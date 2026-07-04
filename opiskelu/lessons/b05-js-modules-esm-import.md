# HTML:ssä `<script src='app.js'>` — import/export ei toimi. Korjaus?

## Tilanne

Kehittäjä siirtää vanhan script-tag -sovelluksen ESM:ään:

```html
<!-- index.html -->
<script src="app.js"></script>
```

```javascript
// app.js
import { init } from './boot.js'; // SyntaxError: Cannot use import statement outside a module
export function start() { init(); }
```

Selain parsii `app.js`:n klassisena skriptinä — `import`/`export` eivät ole sallittuja ilman module-tilaa.

## Ratkaisu

**`<script type="module">`** aktivoi ES modules -tilan:

```html
<!-- index.html -->
<script type="module" src="app.js"></script>
```

Moduuliskriptit deferoivat automaattisesti, suoritetaan järjestyksessä ja ovat strict modessa. Suhteelliset importit tarvitsevat `.js`-päätteen.

## Käytännössä

Legacy-skriptit voivat jäädä `<script defer>` ilman typea. `nomodule`-attribuutti vanhoille polyfill-skripteille. Dev-serverissä (Vite) entry on aina `type="module"`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
