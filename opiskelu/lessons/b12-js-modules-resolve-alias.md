# Monorepossa `@app/utils` pitää resolvautua `packages/utils/src`. Missä konfiguroit bundlerissa?

## Tilanne

Monorepo käyttää alias-importteja:

```javascript
// apps/web/src/App.js
import { formatDate } from '@app/utils';
```

Ilman konfiguraatiota bundler etsii `@app/utils` node_modulesista — moduulia ei löydy.

## Ratkaisu

**`resolve.alias`** bundlerissa (Vite/webpack) **tai** `tsconfig paths`:

```javascript
// vite.config.js
import path from 'node:path';

export default {
  resolve: {
    alias: {
      '@app/utils': path.resolve(__dirname, 'packages/utils/src'),
    },
  },
};
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@app/utils": ["packages/utils/src/index.ts"]
    }
  }
}
```

TypeScript paths auttaa IDE:tä ja tyyppitarkistusta — bundler tarvitsee oman alias-konfiguraationsa.

## Käytännössä

Yhdistä `package.json` workspaces + `exports`-kentät pitkällä aikavälillä. Alias on nopea kehityskikka; julkaistu paketti käyttää oikeaa npm-nimeä.

[Lue lisää](https://vitejs.dev/config/shared-options.html#resolve-alias)
