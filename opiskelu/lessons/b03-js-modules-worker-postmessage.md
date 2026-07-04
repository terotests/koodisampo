# Raskas JSON-parse jäädyttää UI-threadin. Web Worker -integraatio?

## Tilanne

Dashboard parsii 50 MB API-vastausta pääsäikeellä:

```javascript
// main.js
const data = await fetch('/api/huge').then(r => r.json());
const rows = data.items.map(transform); // UI jäätyy 3 sekuntia
renderTable(rows);
```

DevTools Performance näyttää pitkän "long task" -palkin — scroll ja klikkaukset eivät reagoi.

## Ratkaisu

**Web Worker** + **`postMessage`** — raskas työ erillisessä säikeessä:

```javascript
// parser.worker.js
self.onmessage = (e) => {
  const rows = e.data.items.map(transform);
  self.postMessage(rows);
};

// main.js
const worker = new Worker(
  new URL('./parser.worker.js', import.meta.url),
  { type: 'module' }
);

worker.postMessage(await fetch('/api/huge').then(r => r.json()));
worker.onmessage = (e) => renderTable(e.data);
```

`postMessage` käyttää structured clone -algoritmia — data kopioidaan workerille (ei jaettua muistia).

## Käytännössä

Siirrä vain CPU-raskas osa workeriin — DOM-päivitykset pysyvät main threadissä. Suurille payloadeille harkitse `Transferable` (ArrayBuffer). Worker-moduulit tarvitsevat `{ type: 'module' }` jos käytät import/exportia workerissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
