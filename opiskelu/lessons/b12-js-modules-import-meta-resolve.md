# Node 20+ resolvaa specifierin suhteessa moduuliin?

## Tilanne

ESM-skripti tarvitsee absoluuttisen polun riippuvuuteen:

```javascript
// loader.mjs
import { readFile } from 'node:fs/promises';
const path = './templates/email.html'; // suhteellinen cwd:hen — epäluotettava
```

Haluat resolvata `'./templates/email.html'` samalla tavalla kuin `import` — suhteessa nykyiseen moduuliin.

## Ratkaisu

**`import.meta.resolve(specifier)`** — Node 20+:

```javascript
// loader.mjs
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const templateUrl = import.meta.resolve('./templates/email.html');
const templatePath = fileURLToPath(templateUrl);
const html = await readFile(templatePath, 'utf8');
```

Palauttaa file:// URL resolvattuna moduulin kontekstissa — sama logiikka kuin import-polun resoluutio.

## Käytännössä

Käytä `fileURLToPath` tiedostojärjestelmäoperaatioihin. Ero `new URL(spec, import.meta.url)`: resolve noudattaa package exports -sääntöjä. Saatavilla myös experimental-muodossa aiemmissa Node-versioissa.

[Lue lisää](https://nodejs.org/api/esm.html#importmetaresolvespecifier)
