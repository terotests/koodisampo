# Paginoitu API — haluat for-await silmukan joka hakee sivut automaattisesti. Pattern?

## Tilanne

Tuotelistaus-API palauttaa sivutettua dataa: `?page=1&limit=50`, seuraava sivu linkistä `next`. Nykyinen koodi kopioi saman while-silmukan joka paikkaan — 40 riviä toistoa kolmessa eri näkymässä.

Tiimi haluaa siistin `for await`-silmukan, joka hakee sivut automaattisesti.

## Ratkaisu

**Async generator + for await...of:**

```javascript
async function* fetchPages(baseUrl) {
  let url = baseUrl;
  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    yield data.items;
    url = data.nextPageUrl;
  }
}

for await (const page of fetchPages("/api/products?page=1")) {
  renderProducts(page);
}
```

Generaattori abstraktoi paginaatiologiikan — kutsuja näkee vain sivu kerrallaan.

## Käytännössä

Async generatorit sopivat paginoituun API:hin, stream-lukemiseen ja retry-logiikkaan. Muista try/finally generaattorissa resurssien vapauttamiseen. TypeScript: `AsyncGenerator<T>`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator)
