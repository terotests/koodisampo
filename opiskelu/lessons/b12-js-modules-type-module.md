# Node-projektin .js-tiedostot käyttävät `import`-syntaksia. Mikä package.json-asetus kertoo Nodelle eksplisiittisesti, että ne ovat ES-moduuleja?

## Tilanne

Kehittäjä kirjoittaa modernia JavaScriptiä:

```javascript
// index.js
import { createServer } from 'node:http';
export function start() { /* ... */ }
```

Vanhemmissa Node-versioissa tämä kaatuu:

```text
SyntaxError: Cannot use import statement outside a module
```

Ilman `"type"`-kenttää `.js`-tiedostot ovat oletuksena CommonJS:ää. Node 22.7:stä (ja 20.19:stä) alkaen syntaksintunnistus ajaa tiedoston silti ESM:nä, mutta tulostaa varoituksen ja joutuu jäsentämään tiedoston kahdesti. Eksplisiittinen asetus on selkeämpi ja nopeampi.

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
