# Callback hell API-ketjussa — kolme peräkkäistä fetch-kutsua. Moderni refaktorointi?

## Tilanne

Legacy-koodi ketjuttaa kolme fetch-kutsua callback-tyylillä — "callback hell":

```javascript
fetchUser(id, (err, user) => {
  fetchOrders(user.id, (err, orders) => {
    fetchInvoice(orders[0].id, (err, invoice) => {
      render(invoice);
    });
  });
});
```

Refaktorointi tarvitaan — koodi on lukukelvoton ja virheenkäsittely puuttuu.

## Ratkaisu

**async/await — litteä async flow:**

```javascript
async function loadInvoice(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const invoice = await fetchInvoice(orders[0].id);
    render(invoice);
  } catch (err) {
    showError(err);
  }
}
```

Promise chain -vaihtoehto: `.then().then().catch()` — sama logiikka ilman async-syntaksia.

## Käytännössä

async/await on luettavampi kuin nested callbacks. Parallelisoi riippumattomat vaiheet Promise.all:lla. Älä unohda try/catch — callback hellin korjaus bez virheenkäsittelyä on vain siistimpi katastrofi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
