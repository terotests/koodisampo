# Miten tuot moduulin `utils.js` funktion `format` ESM-tyylillä?

## Tilanne

Frontend-projektissa `app.js` tarvitsee päivämäärän muotoilua. Funktio on eristetty `utils.js`-tiedostoon, mutta kehittäjä yrittää kutsua sitä globaalisti:

```javascript
// app.js — ei toimi ESM:ssä
format(new Date()); // ReferenceError: format is not defined
```

```javascript
// utils.js
export function format(date) {
  return date.toLocaleDateString('fi-FI');
}
```

Selaimessa ja Nodessa moduulit eivät vuoda symboleja globaaliin scopeen — funktio pitää tuoda eksplisiittisesti.

## Ratkaisu

**Named import** suhteellisella polulla:

```javascript
// app.js
import { format } from './utils.js';

console.log(format(new Date()));
```

ESM vaatii täyden tiedostopolun (`.js`-pääte selaimessa ja Nodessa). Aaltosulkeet `{ format }` tarkoittavat named exportia — ei defaultia.

## Käytännössä

Käytä named importteja, kun moduulista tarvitaan tiettyjä funktioita — bundler voi tree-shakeata käyttämättömät. Jos importtaat monta symboolia samasta tiedostosta, voit ryhmitellä: `import { format, parse, clamp } from './utils.js'`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
