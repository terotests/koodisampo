# Paginoitu API palauttaa sivuja yksi kerrallaan. Haluat kuluttaa ne silmukassa ilman manuaalista while(nextPage)-logiikkaa. Mikä kieliominaisuus tuottaa asynkronisen iteraattorin?

## Tilanne

CRM-järjestelmä hakee asiakkaita sivutetusta API:sta. Jokaisessa näkymässä kopioitu while-silmukka cursor/offset-logiikalla. Refaktorointi halutaan tehdä niin, että kutsuja saa yksinkertaisen for-silmukan ilman paginaatiotietoja.

## Ratkaisu

**async function* — async generator for await...of:lle:**

```javascript
async function* fetchAllCustomers(pageSize = 100) {
  let offset = 0;
  while (true) {
    const res = await fetch(`/api/customers?offset=${offset}&limit=${pageSize}`);
    const { items, hasMore } = await res.json();
    yield items;
    if (!hasMore) break;
    offset += pageSize;
  }
}

for await (const batch of fetchAllCustomers()) {
  for (const customer of batch) {
    exportRow(customer);
  }
}
```

## Käytännössä

Generaattori kapseloi paginaation — testattavissa erikseen. Lisää retry ja backoff generaattorin sisään. Muista rate limiting API:n mukaan — yield ei tarkoita "loputon nopeus".

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)
