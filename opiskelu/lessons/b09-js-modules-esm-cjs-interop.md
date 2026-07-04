# Node-projektissa `require('esm-only-pkg')` kaatuu. Oikea lähestymistapa?

## Tilanne

Uusi npm-paketti on merkitty `"type": "module"` eikä tarjoa CommonJS-buildia:

```javascript
// legacy-script.cjs
const chalk = require('chalk-v5'); // ERR_REQUIRE_ESM
console.log(chalk.green('hello'));
```

Projekti on CommonJS (`"type": "commonjs"`) — `require` ei voi ladata puhdasta ESM-pakettia.

## Ratkaisu

**Siirry `"type": "module"`** tai käytä **dynamic import()** ESM-only paketeille:

```javascript
// vaihtoehto 1 — koko projekti ESM
// package.json: "type": "module"
import chalk from 'chalk';

// vaihtoehto 2 — CJS-tiedostossa async wrapper
async function main() {
  const chalk = (await import('chalk')).default;
  console.log(chalk.green('hello'));
}
main();
```

Node 22+ tukee require→ESM joissain tapauksissa, mutta luotettavin tapa on ESM tai dynamic import.

## Käytännössä

Uudet projektit: aloita `"type": "module"`. Migraatio: `.cjs` vanhoille tiedostoille, `.mjs` uusille. Tarkista riippuvuudet `npm ls` ennen siirtymää.

[Lue lisää](https://nodejs.org/api/esm.html)
