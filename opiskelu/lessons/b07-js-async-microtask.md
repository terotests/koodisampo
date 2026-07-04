# console.log järjestys: sync, Promise.then, setTimeout. Mikä tulostuu toisena?

## Tilanne

Event loop -testi tiimin teknisessä keskustelussa:

```javascript
console.log("sync");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);
```

Kysymys: mikä tulostuu toisena? Vastaus **promise** — mutta miksi timeout ei tule heti synkronisen jälkeen?

## Ratkaisu

**Promise.then (microtask) ennen setTimeout (macrotask).**

```javascript
console.log("sync");        // 1. ensimmäinen
Promise.resolve().then(() => console.log("promise")); // 2. toinen
setTimeout(() => console.log("timeout"), 0);          // 3. kolmas
```

Event loop käsittelee: call stack → microtask queue (tyhjennys) → yksi macrotask → microtaskit → seuraava macrotask...

## Käytännössä

Tämä selittää miksi Promise-callbackit ajetaan ennen setTimeout(0):aa. Kriittinen kun debuggaat React batchingia, Vue nextTickiä tai custom scheduler-koodia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
