# Debug: console.log(1); Promise.resolve().then(()=>log(2)); queueMicrotask(()=>log(3)); log(4). Tulostus?

## Tilanne

Debug-sessiossa tiimi seuraa lokijärjestystä init-koodissa:

```javascript
console.log(1);
Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
console.log(4);
```

Kaksi kehittäjää väittää eri järjestystä: toinen odottaa 1-2-3-4, toinen 1-4-3-2.

## Ratkaisu

**Tulostus: 1, 4, 2, 3**

```javascript
console.log(1);                              // synkroninen
Promise.resolve().then(() => console.log(2)); // microtask (FIFO)
queueMicrotask(() => console.log(3));         // microtask (FIFO)
console.log(4);                              // synkroninen
// Synkroninen ensin: 1, 4
// Sitten microtask-jono: 2, 3 (järjestyksessä)
```

Sekä Promise.then että queueMicrotask menevät samaan microtask-jonoon.

## Käytännössä

queueMicrotask on eksplisiittinen tapa ajaa koodi ennen seuraavaa macrotaskia. React 18 batchaa päivitykset microtask-tasolla — ymmärrä tämä ennen kuin debuggaat "out-of-order" renderöintejä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
