# console.log järjestys: sync, Promise.resolve().then, setTimeout(0). Mikä ensin microtask jonossa?

## Tilanne

Junior-kehittäjä testaa event loop -käyttäytymistä konsolissa:

```javascript
console.log("sync");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);
```

Hän odottaa: sync → timeout → promise, koska setTimeout on "nollan millisekunnin viive". Tulos on kuitenkin sync → promise → timeout.

## Ratkaisu

**Promise.then (microtask) ajetaan ennen setTimeout (macrotask).**

```javascript
console.log("sync");           // 1. synkroninen
Promise.resolve().then(() => console.log("promise")); // 2. microtask
setTimeout(() => console.log("timeout"), 0);        // 3. macrotask
// Tulostus: sync, promise, timeout
```

Event loop tyhjentää microtask-jonon kokonaan ennen kuin ottaa seuraavan macrotaskin.

## Käytännössä

setTimeout(fn, 0) ei tarkoita "heti" — se tarkoittaa "seuraavassa macrotask-kierroksessa microtaskien jälkeen". Jos tarvitset ajon heti synkronisen koodin jälkeen, käytä `queueMicrotask` tai Promise.then.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
