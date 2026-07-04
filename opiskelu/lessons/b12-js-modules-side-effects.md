# Bundleri poistaa `import './polyfill.js'` tree-shakingissa ja polyfill puuttuu prodissa. Syy?

## Tilanne

Sovellus tarvitsee polyfillin vanhoille selaimille:

```javascript
// main.js
import './polyfill.js'; // ei exportteja — pelkkä sivuvaikutus
import { app } from './app.js';

app.start();
```

Dev toimii, mutta production-buildissa IE11 / vanha Safari kaatuu — polyfill-moduuli puuttuu bundlista.

## Ratkaisu

**Side-effect import** — bundler luulee moduulin kuolleeksi koodiksi ja poistaa sen tree-shakingissa. Korjaus:

```json
// package.json
{
  "sideEffects": ["./src/polyfill.js", "*.css"]
}
```

Tai merkitse koko paketti side-effectilliseksi: `"sideEffects": true` (ei suositella laajasti).

Varmista että import säilyy entrypointissa — älä poista sitä refaktoroinnissa.

## Käytännössä

Webpack lukee `sideEffects`-kentän `package.json`:sta. Vite/Rollup: `treeshake.moduleSideEffects` tai `"sideEffects"` samalla tavalla. CSS-importit (`import './styles.css'`) tarvitsevat saman — ne ovat puhtaita sivuvaikutuksia.

[Lue lisää](https://webpack.js.org/guides/tree-shaking/)
