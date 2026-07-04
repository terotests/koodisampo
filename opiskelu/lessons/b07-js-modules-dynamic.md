# Admin-paneeli on harvoin käytössä — haluat ladata sen koodin vain tarvittaessa. ES module?

## Tilanne

SPA:n reititys lataa kaiken JavaScriptin yhdellä bundlella. Admin-näkymä sisältää taulukkokomponentteja, oikeuksien hallintaa ja raportointia — yhteensä 250 KB gzipattuna.

```javascript
// routes.js
import AdminRoutes from './admin/routes.js';
import UserRoutes from './user/routes.js';
```

99 % käyttäjistä ei koskaan näe admin-reittiä.

## Ratkaisu

**Dynamic import()** — lazy load admin-moduuli vain tarvittaessa code splittingillä:

```javascript
// routes.js
const adminRoutes = () => import('./admin/routes.js');

router.beforeEach(async (to) => {
  if (to.meta.requiresAdmin) {
    const { default: AdminRoutes } = await adminRoutes();
    registerRoutes(AdminRoutes);
  }
});
```

Bundleri luo erillisen chunkin — selain lataa sen vasta kun admin-reitti aktivoituu.

## Käytännössä

Yhdistä roolitarkistus + dynamic import — älä lataa admin-chunkia ennen auth-vahvistusta. Monitoroi chunk-kokoja build-analyysillä (rollup-plugin-visualizer).

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
