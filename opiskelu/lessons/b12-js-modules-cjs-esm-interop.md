# Node ESM importtaa CommonJS-moduulin — default export?

## Tilanne

Legacy npm-paketti on CommonJS:

```javascript
// legacy.cjs
module.exports = function parse(input) { return JSON.parse(input); };
module.exports.VERSION = 1;
```

ESM-koodi importtaa sen:

```javascript
// app.mjs
import parse from 'legacy-parser';
console.log(parse('{}')); // toimiiko?
console.log(parse.VERSION);
```

Node tekee automaattisen interop-käännöksen — mutta tulos yllättää.

## Ratkaisu

**Default voi olla `module.exports` wrapper** — tarkista Node interop:

```javascript
// app.mjs
import pkg from 'legacy-parser';
const parse = pkg.default ?? pkg; // Node 20+: default on module.exports
console.log(parse.VERSION ?? pkg.VERSION);
```

Node asettaa `module.exports` default-exportiksi. Named exportit CJS:stä tulevat propertyina default-objektissa (`pkg.VERSION`), ei erillisinä named importteina (paitsi `module.exports`-analyysin kautta).

## Käytännössä

Suosi ESM-yhteensopivia paketteja. `createRequire` vanhoille tapauksille. Testaa: `node --input-type=module -e "import x from 'pkg'; console.log(x)"`.

[Lue lisää](https://nodejs.org/api/esm.html)
