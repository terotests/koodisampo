# ES module init lataa config.json ennen exportteja — miten ilman async IIFE?

## Tilanne

Moduuli exporttaa valmiin config-objektin, mutta data tulee verkosta:

```javascript
// settings.js — async IIFE on ruma
let settings;
(async () => {
  settings = await fetch('/config.json').then(r => r.json());
})();

export function get(key) {
  return settings?.[key]; // undefined bootissa
}
```

Testit ja importtaajat eivät tiedä milloin settings on valmis.

## Ratkaisu

**Top-level await** moduulissa — `await fetch` ennen export-lauseita:

```javascript
// settings.js
const response = await fetch('/config.json');
export const settings = await response.json();

export function get(key) {
  return settings[key];
}
```

Moduuligraafi odottaa `settings.js`:n valmistumista ennen riippuvaisten moduulien suoritusta.

## Käytännössä

Node-testeissä mockaa `global.fetch` ennen importtia tai käytä `await import('./settings.js')` testissä. JSON-tiedosto voidaan lukea myös `import config from './config.json' with { type: 'json' }` jos se on staattinen — ei tarvitse fetchia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
