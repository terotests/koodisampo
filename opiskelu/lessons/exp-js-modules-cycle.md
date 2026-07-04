# Circular import: a.js importtaa b.js ja toisin päin — export undefined runtime. Ensimmäinen korjaus?

## Tilanne

Mallissa ja näkymässä on ristiriippuvuus:

```javascript
// models/user.js
import { validateEmail } from '../views/form.js';
export class User { /* ... */ }

// views/form.js
import { User } from '../models/user.js';
export function validateEmail(email) {
  return new User(email).isValid();
}
```

Bootissa `validateEmail` on `undefined` tai heittää TypeErroria. ESM sallii syklit, mutta moduuli ei ole täysin evaluoitu, kun toinen lukee sen exportteja (TDZ).

## Ratkaisu

**Refaktoroi jaettu logiikka erilliseen kolmanteen moduuliin** — rikkoo syklin:

```javascript
// validation/email.js — ei riippuvuuksia malleihin tai näkymiin
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// models/user.js
import { validateEmail } from '../validation/email.js';

// views/form.js
import { validateEmail } from '../validation/email.js';
import { User } from '../models/user.js';
```

Kolmas moduuli on lehti dependency-grafissa — molemmat voivat importata sitä ilman ympyrää.

## Käytännössä

Jos refaktorointi ei onnistu heti, harkitse lazy importia (`await import()`) funktion sisällä — mutta se on väliaikainen paikka. ESLint `import/no-cycle` auttaa löytämään syklit CI:ssä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
