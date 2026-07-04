# Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — vanha vastaus ylikirjoittaa uuden. Korjaus?

## Tilanne

Single-page-sovelluksessa käyttäjä vaihtaa tuotekategoriaa nopeasti. Jokainen klikkaus käynnistää uuden fetchin, mutta edelliset pyynnöt jatkuvat. Hidas vastaus kategoriasta "Kengät" saapuu myöhässä ja ylikirjoittaa "Takit"-kategorian tuotteet.

Bugiraportteja tulee viikoittain — "väärät tuotteet listalla".

## Ratkaisu

**AbortController — abort edellinen pyyntö uuden alkaessa:**

```javascript
let controller;

async function loadCategory(categoryId) {
  controller?.abort();
  controller = new AbortController();

  const res = await fetch(`/api/products?cat=${categoryId}`, {
    signal: controller.signal,
  });
  renderProducts(await res.json());
}
```

Uusi kategoria-aborttaa edellisen — vain viimeisin vastaus renderöidään.

## Käytännössä

Pidä controller refissä (useRef Reactissa). Ignoroi AbortError catchissa. Tämä on "stale response" -ongelman standardiratkaisu ilman request ID -laskureita.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
