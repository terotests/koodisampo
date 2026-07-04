# config.mjs pitää ladata ennen appin init — callback pyramid. Moderni moduulitason ratkaisu?

## Tilanne

Sovellus tarvitsee remote-configin ennen kuin mitään exportataan. Vanha tapa kasvaa nopeasti:

```javascript
// config.js — callback-helvetti
let config;
fetch('/api/config')
  .then(r => r.json())
  .then(c => { config = c; initApp(config); })
  .catch(err => console.error(err));

export function getConfig() {
  if (!config) throw new Error('not ready');
  return config;
}
```

Jokainen moduuli joutuu tarkistamaan, onko config valmis — race conditioneja ja monimutkaista virheenkäsittelyä.

## Ratkaisu

**Top-level await** ES-moduulissa — moduuli odottaa ennen exporttia:

```javascript
// config.mjs
const response = await fetch('/api/config');
export const config = await response.json();
```

```javascript
// app.mjs
import { config } from './config.mjs';
// config on valmis — moduuligraafi odotti config.mjs:n valmistumista
startApp(config);
```

Importtaajat eivät suoritu ennen kuin `config.mjs` on täysin evaluoitu.

## Käytännössä

Top-level await vaatii ESM:n (`type: "module"` tai `.mjs`). Älä käytä joka moduulissa — vain init-ketjun juuressa. Virheenkäsittely: `try/catch` moduulin ylätasolla tai erillinen `bootstrap.mjs`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
