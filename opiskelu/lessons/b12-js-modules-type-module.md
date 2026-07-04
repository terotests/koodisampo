# Node-projekti käyttää `import` ilman Babelia. package.json-asetus?

## Tilanne

Kehittäjä kirjoittaa modernia JavaScriptiä:

```javascript
// index.js
import { createServer } from 'node:http';
export function start() { /* ... */ }
```

Node kaatuu:

```text
SyntaxError: Cannot use import statement outside a module
```

Ilman `"type": "module"` Node tulkitsee `.js`-tiedostot CommonJS:ksi — `import`/`export` eivät kelpaa.

## Ratkaisu

**`"type": "module"`** `package.json`:ssa:

```json
{
  "name": "my-app",
  "type": "module",
  "main": "index.js"
}
```

Tämän jälkeen kaikki `.js`-tiedostot projektissa ovat ESM oletuksena. CommonJS vaatii `.cjs`-päätteen.

## Käytännössä

Vaihtoehto ilman package.json-muutosta: nimeä tiedosto `.mjs`. Monorepossa voit asettaa `"type": "module"` vain yhteen pakettiin. `__dirname` korvataan: `import.meta.url` + `fileURLToPath`.

[Lue lisää](https://nodejs.org/api/packages.html#type)
