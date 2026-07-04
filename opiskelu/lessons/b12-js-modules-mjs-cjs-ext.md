# Node ESM-tiedosto ilman type module?

## Tilanne

Projektissa on CommonJS (`"type": "commonjs"`) mutta yksi skripti tarvitsee `import`:

```javascript
// migrate.js — package.json sanoo commonjs
import { readFile } from 'node:fs/promises';
```

Node hylkää: `Cannot use import statement outside a module`. Koko projektia ei haluta vielä siirtää ESM:ään.

## Ratkaisu

**Käytä `.mjs`-päätettä** — Node tulkitsee sen aina ESM:ksi riippumatta `type`-kentästä:

```javascript
// migrate.mjs
import { readFile } from 'node:fs/promises';
```

Vastaavasti `.cjs` pakottaa CommonJS:n `"type": "module"`-projektissa.

## Käytännössä

Vaihtoehto: `"type": "module"` koko paketille. Sekaprojekti: `.mjs` uusille ESM-skripteille, `.cjs` vanhoille `require`-tiedostoille. CI:ssä varmista että ajat `node migrate.mjs` eikä `.js`-versiota.

[Lue lisää](https://nodejs.org/api/esm.html)
