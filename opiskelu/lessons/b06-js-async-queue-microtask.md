# console.log järjestys: sync, setTimeout(0), promise.then. Mitä tulostuu ensin promise:n jälkeen?

## Tilanne

Konsolissa testataan:

```javascript
console.log("sync");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
```

Tiimi kysyy: mikä tulostuu promise:n ja timeoutin välissä? Vastaus: promise ensin — mutta miksi timeout ei aja "nollan ms" viiveellä heti?

## Ratkaisu

**Promise.then ajetaan microtask-jonossa ennen setTimeout-macrotaskia.**

```javascript
console.log("sync");           // 1
Promise.resolve().then(() => console.log("promise")); // 2 (microtask)
setTimeout(() => console.log("timeout"), 0);         // 3 (macrotask)
// Tulostus: sync, promise, timeout
```

setTimeout(0) ei tarkoita "heti" — callback menee macrotask-jonoon, joka odottaa microtask-jonon tyhjentymistä.

## Käytännössä

Jos tarvitset koodin ajon heti synkronisen blokin jälkeen mutta ennen I/O:ta, käytä queueMicrotask tai Promise.then — ei setTimeout(0).

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
