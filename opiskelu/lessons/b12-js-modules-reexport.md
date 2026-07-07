# Monorepon barrel-tiedosto kokoaa julkisen API:n kahdesta moduulista ilman import+export -kahdetta askelta. Mikä export-lauseke?

## Tilanne

Kirjastopaketin kuluttajat importtaavat yhdestä entrypointista:

```javascript
// Nykyinen — käsin
import { debounce } from './utils.js';
import { fetchUser } from './api.js';
export { debounce, fetchUser };
```

Kaksi importtia ja exporttia — turhaa toistoa kun moduuleja on kymmeniä.

## Ratkaisu

**Re-export** `export ... from` -syntaksilla:

```javascript
// index.js
export * from './utils.js';
export { fetchUser, createUser } from './api.js';
```

`export *` tuo kaikki named exportit utils-moduulista. `export { x } from` valitsee tiettyjä symboleja api-moduulista — ei luo välimuuttujia.

## Käytännössä

Yhdistä `package.json` `exports`-kenttään:

```json
"exports": { ".": "./index.js" }
```

Varo name collision: jos molemmat exporttaavat saman nimen, syntaksivirhe. Dokumentoi julkiset vs sisäiset moduulit.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
