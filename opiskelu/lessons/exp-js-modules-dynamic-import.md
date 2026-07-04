# Admin-näkymän bundle on liian iso — haluat ladata sen vain admin-reitillä. Miten?

## Tilanne

React-router-sovelluksessa admin-paneeli vie 400 KB chart-kirjastoja ja taulukoita. Kaikki käyttäjät lataavat sen, vaikka vain 2 % on admineja:

```javascript
// routes.js — kaikki bundlessa heti
import AdminPanel from './AdminPanel.js';
import { Chart } from 'chart.js';

export const routes = [
  { path: '/admin', component: AdminPanel },
  { path: '/', component: Home },
];
```

Lighthouse raportoi turhaa JavaScriptiä initial loadissa.

## Ratkaisu

**Dynamic `import()`** reitillä — code splitting erilliseen chunkiin:

```javascript
// routes.js
export const routes = [
  {
    path: '/admin',
    component: () => import('./AdminPanel.js'),
  },
  { path: '/', component: Home },
];

// tai suoraan handlerissa
async function openAdmin() {
  const { AdminPanel } = await import('./AdminPanel.js');
  render(AdminPanel());
}
```

`import()` palauttaa `Promise<module>` — bundler (Vite, webpack) luo erillisen chunkin, joka latautuu vasta kun reitti aktivoituu.

## Käytännössä

Lisää loading-spinner odotuksen ajaksi. Prefetch admin-chunkia hoverilla, jos UX vaatii nopeutta. Älä dynamic-importtaa kriittistä polkua (login, auth) — vain harvoin käytettyjä näkymiä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
