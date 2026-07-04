# JSON config moduuli — haluat importtaa JSON ESM:ssä turvallisesti. Miten?

## Tilanne

Sovellus lukee build-aikaisen configin JSON-tiedostosta:

```javascript
// app.js — vanha tapa, ei toimi suoraan selaimessa
import config from './config.json'; // TypeError tai bundler-varoitus
```

Node ja bundlerit ovat käsitelleet JSON-importteja eri tavoin — selain vaatii eksplisiittisen tyypin, muuten moduuli tulkitaan JavaScriptiksi.

## Ratkaisu

**Import attribute** `with { type: 'json' }`:

```javascript
// app.js
import config from './config.json' with { type: 'json' };

console.log(config.apiUrl);
```

Attribuutti kertoo loaderille, että tiedosto on JSON — ei suoritettavaa JS:ää. Node 20+ ja modernit bundlerit tukevat tätä.

## Käytännössä

Vanhempi syntaksi `assert { type: 'json' }` on korvautumassa `with`-lausekkeella. Vite/webpack saattavat vielä käsitellä JSON-importin ilman attribuuttia build-vaiheessa — tuotanto-ESM selaimessa attribuutti on pakollinen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
