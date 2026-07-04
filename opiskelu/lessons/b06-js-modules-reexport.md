# Barrel file exporttaa utils-moduulien API yhdessä paikassa. Miten?

## Tilanne

Monorepon `packages/shared/src/` sisältää kymmeniä tiedostoja. Kuluttajat eivät saa importata suoraan syvältä:

```text
packages/shared/src/string/capitalize.js
packages/shared/src/string/trim.js
packages/shared/src/number/clamp.js
```

Haluat yhden julkisen entrypointin `@app/shared` ilman että jokainen export lisätään käsin import + export -parina.

## Ratkaisu

**Re-export** `export ... from` -syntaksilla:

```javascript
// packages/shared/src/index.js
export { capitalize, trim } from './string/index.js';
export { clamp } from './number/clamp.js';
export * from './date/format.js';
```

Ei tarvitse:

```javascript
import { capitalize } from './string/capitalize.js';
export { capitalize }; // turha välivaihe
```

## Käytännössä

`package.json` `exports`-kenttä osoittaa barrel-tiedostoon. Varo `export *` kaikkeen — se voi vuotaa sisäisiä symboleja. Jotkut bundlerit hidastuvat liian suurista barreleista; harkitse subpath exportteja (`@app/shared/string`).

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/export)
