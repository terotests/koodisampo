# Haluat uudelleenexportata useita util-funktioita yhdestä entrypointista. Syntax?

## Tilanne

Projektissa on kymmeniä util-tiedostoja, mutta ulkoisen API:n pitää olla yksi import-polku:

```javascript
// Nykyinen — kuluttajat importtaavat syvältä
import { debounce } from './utils/debounce.js';
import { clamp } from './utils/clamp.js';
import { formatDate } from './utils/date.js';
```

Haluat `index.js`-barrelin, joka paljastaa kaiken ilman että jokainen funktio importataan ja exportataan erikseen.

## Ratkaisu

**Re-export** `export ... from` -syntaksilla — ei erillistä importtia:

```javascript
// utils/index.js
export { debounce } from './debounce.js';
export { clamp } from './clamp.js';
export { formatDate } from './date.js';
```

Kuluttaja:

```javascript
import { debounce, clamp, formatDate } from './utils/index.js';
```

Voit myös exportata kaiken: `export * from './debounce.js';`

## Käytännössä

Barrel helpottaa refaktorointia (sisäiset polut voivat muuttua), mutta voi hidastaa tree-shakingia jos exportataan liikaa. Preferoi named re-exporteja — älä `export *` kaikkeen ilman tarkoitusta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
