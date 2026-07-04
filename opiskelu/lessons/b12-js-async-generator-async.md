# Streamaat paginoitua API:a — haluat `for await` silmukan. Funktion tyyppi?

## Tilanne

Paginoitu REST API palauttaa sivuja `next`-linkillä. Haluat kuluttaa kaiken datan yksinkertaisella for-silmukalla ilman toistuvaa offset-logiikkaa joka tiedostossa.

## Ratkaisu

**async function* — async generator tuottaa async iterablen:**

```javascript
async function* fetchPages(url) {
  while (url) {
    const res = await fetch(url);
    const page = await res.json();
    yield page.items;
    url = page.next;
  }
}

for await (const items of fetchPages("/api/items?page=1")) {
  processBatch(items);
}
```

Funktion tyyppi: async generator — palauttaa AsyncGenerator.

## Käytännössä

Generaattorit abstraktoivat paginaation testattavaksi yksikköön. Lisää AbortSignal generaattoriin pitkiin haukoihin. TypeScript: `AsyncGenerator<Item[], void, unknown>`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)
