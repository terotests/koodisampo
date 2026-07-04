# import * as utils from './utils.js' — utils on?

## Tilanne

Moduuli exporttaa useita funktioita:

```javascript
// utils.js
export function debounce(fn, ms) { /* ... */ }
export function throttle(fn, ms) { /* ... */ }
export const MAX_RETRIES = 3;
```

Kehittäjä haluaa kaiken yhteen objektiin ilman että listaa jokaisen nimen:

```javascript
import * as utils from './utils.js';
```

## Ratkaisu

**Namespace-objekti** kaikilla exporteilla:

```javascript
utils.debounce(fn, 300);
utils.throttle(fn, 100);
console.log(utils.MAX_RETRIES);
```

`utils` on module namespace object — sen propertyt ovat live bindingeja alkuperäisiin exportteihin. Ei tavallinen plain object.

## Käytännössä

Namespace import on kätevä REPL:issä ja testeissä. Tree-shaking heikkenee usein — bundler ei aina poista käyttämättömiä propertyja. Preferoi `{ debounce }` named import tuotannossa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
