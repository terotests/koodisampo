# async funktio heittää virheen — caller ei saa stack tracea. Miten käsittelet?

## Tilanne

Async-funktio `processPayment()` heittää virheen sisäisessä await-kutsussa. Kutsuja:

```javascript
processPayment(orderId); // ei await, ei catch
```

DevToolsissa stack trace katkeaa await-rajaan — et näe mistä virhe oikeasti tuli. Tuotannossa maksu jää kesken ilman lokimerkintää.

## Ratkaisu

**try/catch awaitin ympärillä tai .catch() promisen ketjussa:**

```javascript
async function handlePayment(orderId) {
  try {
    await processPayment(orderId);
  } catch (err) {
    console.error("Maksu epäonnistui:", err);
    notifyUser(err.message);
  }
}

// Tai ilman async wrapperia:
processPayment(orderId).catch((err) => {
  console.error(err);
});
```

Async-funktio palauttaa rejected promisen — ilman catchia se on unhandled rejection.

## Käytännössä

Älä koskaan kutsu async-funktiota "fire-and-forget" ilman .catch():ia tuotannossa. Node 15+ kaataa prosessin unhandled rejectioniin oletuksena. Lokita alkuperäinen virhe, älä nielaise sitä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
