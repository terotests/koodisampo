# ES-moduulissa tarvitset nykyisen moduulin URL:n asset-polkuun. Standardi API?

## Tilanne

Node-skripti lukee JSON-tiedoston moduulin vierestä:

```javascript
// loadConfig.js
import { readFileSync } from 'node:fs';
const config = readFileSync('./config.json', 'utf8'); // cwd-riippuvainen!
```

Skripti toimii projektin juuresta, mutta kaatuu kun ajetaan toisesta hakemistosta — `./config.json` viittaa prosessin cwd:hen, ei moduulin sijaintiin.

## Ratkaisu

**`import.meta.url`** moduulin kanoniseen URL:ään:

```javascript
// loadConfig.js
import { readFileSync } from 'node:fs';

const configPath = new URL('./config.json', import.meta.url);
const config = JSON.parse(readFileSync(configPath, 'utf8'));
```

Polku resolvautuu aina suhteessa `loadConfig.js`:ään riippumatta siitä, mistä Node ajetaan.

## Käytännössä

`fileURLToPath(import.meta.url)` antaa tiedostopolun Windowsissa ja Linuxissa. Sama API toimii selaimessa WASM- tai worker-tiedostojen lataukseen — yksi standardi molemmissa ympäristöissä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
