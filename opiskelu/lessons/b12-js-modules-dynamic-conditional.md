# Lataa moduuli vain adminille. Pattern?

## Tilanne

Autentikoinnin jälkeen sovellus tietää käyttäjän roolin, mutta admin-moduuli on jo bundlessa:

```javascript
// bootstrap.js
import './admin/panel.js'; // latautuu kaikille
import { init } from './app.js';

init(currentUser);
```

Admin-koodi (500 riviä + riippuvuuksia) ei saisi latautua tavallisille käyttäjille.

## Ratkaisu

**Ehdollinen dynamic import**:

```javascript
// bootstrap.js
import { init } from './app.js';

async function bootstrap(user) {
  init(user);

  if (user.isAdmin) {
    const { mountAdminPanel } = await import('./admin/panel.js');
    mountAdminPanel();
  }
}

bootstrap(currentUser);
```

`import()` on async — moduuli latautuu ja evaluoidaan vasta kun `isAdmin` on tosi.

## Käytännössä

Tarkista rooli serverillä ennen admin-chunkin palauttamista (API + route guard). Client-side ehto on UX-optimointi, ei turvallisuus. Näytä loading admin-näkymän avauksessa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
