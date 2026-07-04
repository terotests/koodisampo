# Haluat ajaa funktion heti synkronisen koodin jälkeen mutta ennen setTimeout(0). API?

## Tilanne

Kirjasto haluaa ajaa cleanup-funktion heti synkronisen init-koodin jälkeen, mutta ennen setTimeout(0):aa — esim. DOM-muutosten batch ennen paintia. setTimeout(0) on liian hidas; synkroninen kutsu rikkoo järjestyksen.

## Ratkaisu

**queueMicrotask(fn) — ajaa ennen seuraavaa macrotaskia:**

```javascript
initSync();
queueMicrotask(() => {
  cleanupPendingUpdates();
});
// cleanup ajetaan ennen setTimeout/I/O/render
```

Vaihtoehto: `Promise.resolve().then(fn)` — sama microtask-jono.

## Käytännössä

queueMicrotask on eksplisiittisempi kuin Promise.then dummy. React 18 hyödyntää microtaskeja batchingiin. Älä käytä äärettömään microtask-silmukkaan — se estää renderöinnin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
