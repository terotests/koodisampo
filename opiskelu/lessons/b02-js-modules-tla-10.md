# Moduulin top-level await hidastaa koko appin latausta — milloin käyttää?

## Tilanne

Tiimi lisäsi top-level awaitin jokaiseen moduuliin, joka tarvitsee dataa:

```javascript
// theme.mjs
export const theme = await fetch('/api/theme').then(r => r.json());

// i18n.mjs
export const strings = await fetch('/api/locale').then(r => r.json());

// app.mjs
import { theme } from './theme.mjs';
import { strings } from './i18n.mjs';
```

Jokainen import blokkaa moduuligraafin — käyttäjä näkee valkoisen ruudun, vaikka theme voisi ladata taustalla.

## Ratkaisu

**Käytä top-level awaitia vain, kun async-init on pakollinen ennen exporttia.** Muuten erillinen `init()`-funktio:

```javascript
// theme.mjs — ei TLA:ta
let theme;
export async function initTheme() {
  theme = await fetch('/api/theme').then(r => r.json());
}
export function getTheme() { return theme; }

// app.mjs — render heti, päivitä kun valmis
import { initTheme, getTheme } from './theme.mjs';
renderShell();
initTheme().then(() => applyTheme(getTheme()));
```

TLA sopii esim. CLI-työkaluun, jossa koko prosessi odottaa configia — ei interaktiiviseen UI:hin.

## Käytännössä

Top-level await blokkaa kaikki riippuvaiset importit. Mittaa LCP ennen ja jälkeen. Node CLI:ssä TLA on luonteva; selaimessa preferoi lazy init + skeleton UI.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
