# Kirjasto tarjoaa sekä CJS että ESM — hazard?

## Tilanne

Npm-kirjasto julkaisee kaksi buildia:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

Sovellus importtaa ESM:llä, testit require:lla — molemmat lataavat oman kopionsa kirjastosta.

## Ratkaisu

**Dual package hazard** — eri instanssit singletonille:

```javascript
// app.mjs
import { cache } from 'my-lib'; // ESM-instanssi

// test.cjs
const { cache } = require('my-lib'); // CJS-instanssi — ERI objekti!
```

Singleton (cache, event bus, config) ei jaa tilaa — bugi tuotannossa ja testeissä eri käytös.

Korjaus: yksi formaatti, tai varmista että tila on ulkoisessa storessa (Redis, DB), ei moduulin sisäisessä muuttujassa.

## Käytännössä

Node docs suosittelevat `"exports"`-only -lähestymistä. Vältä sisäistä mutable statea kirjastomoduulissa. Jos dual paketti pakollinen, dokumentoi että singleton ei toimi cross-format.

[Lue lisää](https://nodejs.org/api/packages.html#dual-package-hazard)
