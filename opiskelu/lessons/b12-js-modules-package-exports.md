# package.json exports kenttä — miksi?

## Tilanne

Kirjaston kuluttaja importtaa syvältä sisäisestä tiedostosta:

```javascript
import { helper } from 'my-lib/src/internal/helper.js';
```

Seuraavassa versiossa tiedosto siirretään — kuluttajan build hajoaa. Julkinen API ei ole rajattu.

## Ratkaisu

**`exports`-kenttä** määrittää julkiset import-polut ja **estää syväimportit**:

```json
{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

```javascript
import { helper } from 'my-lib';        // OK
import { helper } from 'my-lib/utils';  // OK
import x from 'my-lib/src/internal/helper.js'; // ERR_PACKAGE_PATH_NOT_EXPORTED
```

Voit erottaa ESM/CJS: `"import"` / `"require"` -ehdot exports-objektissa.

## Käytännössä

Moderni paketointi: `exports` + `files`-kenttä (mitä npm publishaa). Dual package: erilliset entryt `"import"` ja `"require"`. Dokumentoi vain exports-kentässä listatut polut.

[Lue lisää](https://nodejs.org/api/packages.html#exports)
