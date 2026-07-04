# Config `port` voi olla 0 — oletus 3000 vain jos null/undefined. Operaattori?

## Tilanne

Dev-serverin konfiguraatio ladataan ympäristömuuttujista ja JSON-tiedostosta:

```javascript
const config = loadConfig(); // { port: 0 } testissä — "satunnainen vapaa portti"
const port = config.port || 3000;
server.listen(port);
```

Operaattori `||` tulkitsee nollan falsy-arvoksi ja korvaa sen 3000:lla. Testi, joka tarkoituksella käyttää porttia 0 (OS valitsee vapaan portin), ei toimi. Sama ongelma esiintyy timeout-arvoissa, retry-laskureissa ja muissa numeerisissa asetuksissa, joissa nolla on validi.

## Ratkaisu

**Nullish coalescing: port ?? 3000 säilyttää arvon 0 sellaisenaan** — se tarkistaa vain `null` ja `undefined`:

```javascript
const port = config.port ?? 3000;
// port === 0  →  kuuntelee porttia 0 (OS valitsee)
// port === undefined  →  3000
```

Koko konfiguraatioputki:

```javascript
const settings = {
  port: env.PORT ?? fileConfig.port ?? 3000,
  host: env.HOST ?? fileConfig.host ?? 'localhost',
};
```

## Käytännössä

Käytä `??` oletusarvoissa, kun nolla, tyhjä merkkijono tai `false` voivat olla tarkoituksellisia arvoja. Käytä `||`, kun haluat korvata kaikki falsy-arvot — esimerkiksi `displayName || 'Nimetön'`, jos tyhjä merkkijono tarkoittaa puuttuvaa nimeä.

MDN: `??` ja `||` eivät voi sekoittua ilman sulkuja samassa lausekkeessa ilman syntax erroria — kirjoita `(a ?? b) || c` tarkoituksella.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
