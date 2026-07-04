# Vanha kirjasto käyttää `readFile(path, cb)` callback-tyyliä. Miten käärit sen await-yhteensopivaksi?

## Tilanne

Projekti migroi callback-pohjaisesta Node-koodista async/await -tyyliin. Vanha kirjasto tarjoaa vain:

```javascript
readFile("/config.json", (err, data) => { ... });
```

Uusi koodi tarvitsee await-yhteensopivan version ilman callback-helvettiläistä.

## Ratkaisu

**util.promisify tai new Promise wrapper:**

```javascript
import { readFile } from "node:fs";
import { promisify } from "node:util";

const readFileAsync = promisify(readFile);
const data = await readFileAsync("/config.json", "utf8");
```

Node 10+ tarjoaa fs/promises:

```javascript
import { readFile } from "node:fs/promises";
const data = await readFile("/config.json", "utf8");
```

## Käytännössä

fs/promises on ensisijainen uudessa koodissa. promisify sopii kolmannen osapuolen callback-API:hin. Varmista error-first callback -konventio ennen promisifyä.

[Lue lisää](https://nodejs.org/api/util.html#utilpromisifyoriginal)
