# Code review: tiedosto export default User ja export const helper — import sekoittuu. Suositus?

## Tilanne

Komponenttimoduuli sekoittaa export-tyypit:

```javascript
// UserCard.js
export default function UserCard(props) { /* ... */ }
export const formatRole = (r) => r.toUpperCase();
export const ROLES = ['admin', 'user'];
```

Kuluttajat importtaavat eri tavoilla — osa `import UserCard from ...`, osa `import { UserCard } from ...` (väärin). Refaktorointi default → named rikkoo kaikki importit hiljaisesti.

## Ratkaisu

**Suosi named exporteja** — eksplisiittinen ja tree-shake-ystävällinen:

```javascript
// UserCard.js
export function UserCard(props) { /* ... */ }
export function formatRole(r) { return r.toUpperCase(); }
export const ROLES = ['admin', 'user'];
```

```javascript
import { UserCard, formatRole } from './UserCard.js';
```

Named exportit näkyvät IDE:ssä, bundler poistaa käyttämättömät, rename-refaktorointi on turvallisempaa.

## Käytännössä

Default export sopii framework-komponenteille (React lazy), jos tiimi pitää siitä kiinni — mutta älä sekoita default + monta named samassa tiedostossa. Yksi tapa per moduuli.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
