# a.js importtaa b.js ja b.js importtaa a.js — undefined export. Miten korjaat?

## Tilanne

Store ja actions jakavat tilan:

```javascript
// store.js
import { increment } from './actions.js';
export let count = 0;
export function dispatch(action) {
  if (action === 'inc') increment();
}

// actions.js
import { count, dispatch } from './store.js';
export function increment() {
  count++; // count on undefined tai TDZ-virhe
}
```

Sovellus kaatuu bootissa — klassinen circular dependency.

## Ratkaisu

**Refaktoroi jaettu riippuvuus kolmanteen moduuliin** — rikkoo import-syklin:

```javascript
// state.js — pelkkä tila, ei actions
export let count = 0;
export function setCount(n) { count = n; }

// actions.js
import { count, setCount } from './state.js';
export function increment() { setCount(count + 1); }

// store.js
import { count } from './state.js';
import { increment } from './actions.js';
export { count, increment };
```

`state.js` ei importtaa ketään — sykli katkeaa.

## Käytännössä

Dependency-grafi: lehtimodulit (utils, state) alhaalla, orchestration ylhäällä. Työkalut: `madge --circular`, ESLint `import/no-cycle`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
