# config.mjs lataa env-tiedoston ennen muita importteja. Ratkaisu?

## Tilanne

config.mjs lataa ympäristömuuttujat tiedostosta ennen muiden moduulien importteja. CommonJS:ssä käytettiin synkronista readFileSync — ES-moduulissa importit hoistataan, joten async lataus pitää tehdä toisin.

## Ratkaisu

**Top-level await ES-moduulissa:**

```javascript
// config.mjs
import { readFile } from "node:fs/promises";

const envText = await readFile(".env", "utf8");
export const config = parseEnv(envText);
```

Muut moduulit: `import { config } from "./config.mjs"` — odottavat automaattisesti config.mjs:n valmistumista.

## Käytännössä

Top-level await toimii vain ES moduleissa (.mjs tai "type":"module"). Se hidastaa moduulin latausta — käytä vain init-kriittiseen configiin. Vite/webpack tukevat TLA:ta. Vältä TLA:ta jos config voidaan lazy-loadata.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
