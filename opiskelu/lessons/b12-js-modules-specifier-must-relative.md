# import from 'lodash' vs './lodash.js' — ero?

## Tilanne

Kehittäjä sekoittaa import-tyypit:

```javascript
import { debounce } from 'lodash';      // npm-paketti
import { helper } from './helpers.js';  // paikallinen tiedosto
import { api } from '../api/index.js';  // suhteellinen polku
```

Yksi toimii ilman polkua, toiset vaativat `./` tai `../` — miksi?

## Ratkaisu

**Paketin nimi vs suhteellinen polku tiedostoon:**

| Specifier | Merkitys |
|-----------|----------|
| `'lodash'` | Node/bundler etsii `node_modules/lodash` — **bare specifier** |
| `'./helpers.js'` | Tiedosto suhteessa importtaavaan moduuliin — **relative** |
| `'node:fs'` | Node built-in moduuli |

ESM selaimessa bare specifierit eivät toimi ilman import mapia (`<script type="importmap">`). Node ja bundlerit resolvaa ne `node_modules`:sta.

## Käytännössä

Paikalliset importit: aina `./` tai `../` + `.js`-pääte (selain/Node ESM). npm-paketit: nimi `package.json` exports-kentän mukaan. Monorepo-alias (`@app/utils`) on bundler-konfiguraatio, ei JavaScript-standardi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
