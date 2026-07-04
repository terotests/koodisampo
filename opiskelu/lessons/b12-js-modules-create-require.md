# ESM-tiedostossa tarvitset require kertaluontoisesti?

## Tilanne

Migraatio ESM:ään — yksi legacy JSON-tiedosto tai CJS-only paketti:

```javascript
// config.mjs
import { readFileSync } from 'node:fs';
// require ei ole määritelty ESM:ssä!
const pkg = require('./legacy-config.cjs'); // ReferenceError
```

Koko projektia ei haluta palauttaa CommonJS:ksi yhden tiedoston takia.

## Ratkaisu

**`createRequire(import.meta.url)`** — luo require-funktion ESM-kontekstissa:

```javascript
// config.mjs
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const legacy = require('./legacy-config.cjs');

export const config = legacy;
```

`import.meta.url` antaa moduulin URL:n — require resolvaa suhteessa siihen kuten CJS:ssä.

## Käytännössä

Preferoi `import()` tai ESM-yhteensopiva paketti pitkällä aikavälillä. `createRequire` sopii migraatioon, testeihin ja JSON:lle ennen natiivia import attributea. Älä jaa `require`-instanssia moduulien välillä — luo tarvittaessa paikallisesti.

[Lue lisää](https://nodejs.org/api/module.html#modulecreaterequirefilename)
