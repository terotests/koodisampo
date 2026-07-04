# Bundleri tarvitsee nykyisen moduulin URL:n runtime asset-polkuun. ES-moduuli-API?

## Tilanne

Web Worker ladataan suhteellisesta polusta, mutta bundler muuttaa tiedostorakennetta buildissa:

```javascript
// workerHost.js — rikki prodissa
const worker = new Worker('./parser.worker.js'); // 404 chunk-polussa
```

Hardkoodattu polku ei toimi, kun moduuli on `/assets/workerHost-abc123.js` ja worker eri hakemistossa.

## Ratkaisu

**`import.meta.url`** — moduulin absoluuttinen URL evaluointihetkellä:

```javascript
// workerHost.js
const workerUrl = new URL('./parser.worker.js', import.meta.url);
const worker = new Worker(workerUrl, { type: 'module' });
```

`new URL(relative, import.meta.url)` resolvaa oikean polun sekä devissä että bundlerin tuottamassa chunkissa.

## Käytännössä

Vite tukee `?worker` ja `?url` suffikseja, mutta `import.meta.url` on standardi fallback. Nodessa sama pattern toimii tiedostojen lukemiseen: `readFileSync(new URL('./data.json', import.meta.url))`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
