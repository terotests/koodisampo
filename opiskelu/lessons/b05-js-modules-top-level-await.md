# Moduulin init tarvitsee config-fetch ennen exportteja. Moderni tapa ilman callback-helvettiä?

## Tilanne

Database-moduuli tarvitsee connection stringin API:sta ennen kuin exporttaa clientin:

```javascript
// db.js — IIFE + callback
let client;
(async () => {
  const cfg = await fetch('/config/db').then(r => r.json());
  client = createClient(cfg.url);
})();

export function query(sql) {
  return client.query(sql); // race: client voi olla undefined
}
```

Kuluttajat saavat satunnaisia virheitä — init ei ole valmis export-lukemisen hetkellä.

## Ratkaisu

**Top-level await** moduulissa — odottaa ennen moduulin valmistumista:

```javascript
// db.js
const cfg = await fetch('/config/db').then(r => r.json());
export const client = createClient(cfg.url);

export function query(sql) {
  return client.query(sql);
}
```

Importtaava moduuli ei suoritu ennen kuin `db.js` on valmis — ei race conditionia.

## Käytännössä

Top-level await vaatii ESM:n. Virhe config-fetchissa kaataa koko import-ketjun — käsittele `try/catch` moduulin juuressa tai erillisessä bootstrap-moduulissa. Älä käytä TLA:ta jokaisessa pienessä util-moduulissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
