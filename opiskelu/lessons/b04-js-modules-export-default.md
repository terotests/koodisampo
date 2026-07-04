# Code review: tiedosto exporttaa sekä default että 5 named exportia — reviewer ihmettelee. Miksi ongelma?

## Tilanne

API-moduuli kasvaa reviewissa:

```javascript
// api.js
export default { get, post, put, del };
export const BASE_URL = '/api/v2';
export const get = (path) => fetch(BASE_URL + path);
export const post = (path, body) => /* ... */;
export const AuthError = class extends Error {};
export const VERSION = 2;
export const helpers = { /* ... */ };
```

Kuluttajat: `import api from './api.js'`, `import { get } from './api.js'`, `import api, { get } from './api.js'` — kolme eri tapaa, duplikaatti `get` default-objektissa ja namedina.

## Ratkaisu

**Sekava API — valitse joko default tai named johdonmukaisesti:**

```javascript
// api.js — vain named
export const BASE_URL = '/api/v2';
export const VERSION = 2;
export function get(path) { /* ... */ }
export function post(path, body) { /* ... */ }
export class AuthError extends Error {}
```

Tai jos yksi entrypoint: `export default { get, post }` **ilman** erillisiä samannimisiä named exportteja.

## Käytännössä

Sekalaiset exportit vaikeuttavat tree-shakingia (default-objekti vetää kaiken mukaan) ja IDE-refaktorointia. Code review -sääntö: yksi export-tyyli per tiedosto, poikkeukset dokumentoidaan.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
