# Moduuli A importtaa B:n ja B importtaa A:n — undefined exportit bootissa. Korjaus?

## Tilanne

Plugin-järjestelmä rekisteröi itsensä automaattisesti:

```javascript
// pluginRegistry.js
import { AuthPlugin } from './authPlugin.js';
export const plugins = [AuthPlugin];

// authPlugin.js
import { register } from './pluginRegistry.js';
export const AuthPlugin = { name: 'auth' };
register(AuthPlugin); // register on undefined
```

Boot kaatuu hiljaisesti — `plugins`-taulukko on tyhjä tai `register` puuttuu.

## Ratkaisu

**Refaktoroi jaettu logiikka kolmanteen moduuliin** — poista import-sykli:

```javascript
// plugins/types.js
export function createPlugin(name, hooks) {
  return { name, hooks };
}

// plugins/authPlugin.js
import { createPlugin } from './types.js';
export const AuthPlugin = createPlugin('auth', { /* ... */ });

// plugins/registry.js
import { AuthPlugin } from './authPlugin.js';
export const plugins = [AuthPlugin];
export function register(plugin) { plugins.push(plugin); }
```

Rekisteröinti tapahtuu eksplisiittisesti bootstrapissa — ei moduulin latauksen sivuvaikutuksena syklissä.

## Käytännössä

Vältä sivuvaikutuksia importin ylätasolla plugin-moduuleissa. `import/no-cycle` CI:ssä. Lazy `import()` rekisteröintiin viivästyttää syklin rikkomista, mutta ei korvaa refaktorointia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
