# REST-kutsu timeout 30s — käyttäjä navigoi pois. Miten peruutat fetchin?

## Tilanne

Mobiilisovelluksen web-näkymä hakee tuotelistan REST-API:sta. Pyyntö kestää joskus 30 sekuntia hitaan verkon takia. Käyttäjä painaa "takaisin" ennen vastauksen saapumista — pyyntö jatkuu taustalla ja kuluttaa kaistaa turhaan.

Backend-lokit näyttävät satoja keskeytymättömiä pyyntöjä per sessio.

## Ratkaisu

**AbortController fetch-opseissa:**

```javascript
const controller = new AbortController();

fetch("/api/products", { signal: controller.signal })
  .then((res) => res.json())
  .then(renderProducts)
  .catch((err) => {
    if (err.name !== "AbortError") showError(err);
  });

// Navigoinnissa tai komponentin unmountissa:
controller.abort();
```

`abort()` peruuttaa pyynnön selaimessa ja vapauttaa resurssit.

## Käytännössä

Yhdistä AbortController route-muutoksiin, React cleanup-funktioihin ja "Peruuta"-nappeihin. Modernit selaimet tukevat natiivisti — ei tarvitse xhr.abort()-workaroundia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
