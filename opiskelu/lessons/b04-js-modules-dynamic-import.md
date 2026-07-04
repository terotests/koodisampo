# Admin-paneeli pitää ladata vain admin-käyttäjille — bundle koko kasvaa. Strategia?

## Tilanne

Sovellus tarkistaa roolin loginin jälkeen, mutta admin-koodi on jo bundlessa:

```javascript
// main.js
import { AdminDashboard } from './admin/Dashboard.js';
import { render } from './ui.js';

if (user.role === 'admin') {
  render(AdminDashboard);
}
```

Webpack/Vite-analyysi näyttää admin-moduulit initial chunkissa — tavallinen käyttäjä lataa turhaa 300 KB.

## Ratkaisu

**Dynamic import()** roolitarkistuksen jälkeen:

```javascript
// main.js
import { render } from './ui.js';

async function showDashboard(user) {
  if (user.role === 'admin') {
    const { AdminDashboard } = await import('./admin/Dashboard.js');
    render(AdminDashboard);
  } else {
    render(UserHome);
  }
}
```

Bundler erottaa `./admin/Dashboard.js` omaksi lazy-chunkikseen — latautuu vain kun haara ajetaan.

## Käytännössä

Varmista että admin-moduuli ei importtaudu vahingossa muualta (esim. barrel-tiedosto). Route-level splitting (React Router lazy) skaalaa paremmin kuin if-lause mainissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
