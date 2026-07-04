# ESM importit hoistataan — sivuvaikutus järjestyksessä?

## Tilanne

Kehittäjä luottaa suoritusjärjestykseen:

```javascript
// main.js
console.log('1: setup');
import { init } from './init.js'; // odottaa ajettavan tässä?
console.log('2: after import');

// init.js
console.log('init runs');
export function init() {}
```

Odotus: `1 → import → init runs → 2`. Todellisuus erilainen.

## Ratkaisu

**Staattiset importit ajetaan ennen moduulin koodia dependency-järjestyksessä:**

1. Parser kerää kaikki `import`-lauseet (hoisting)
2. Riippuvuusmoduulit evaluoidaan ensin (syvä ensin)
3. Vasta sitten moduulin oma koodi suoritetaan

Todennäköinen tuloste:

```text
init runs
1: setup
2: after import
```

Import-lauseen sijainti tiedostossa ei vaikuta — aina ennen moduulin bodya.

## Käytännössä

Älä luota importtien sijaintiin sivuvaikutusten järjestyksessä. Dynamic `import()` suoritetaan siinä kohdassa missä kutsutaan. Side-effect importit (`import './polyfill.js'`) ajetaan dependency-vaiheessa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
