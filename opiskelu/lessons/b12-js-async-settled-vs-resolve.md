# finally-blokissa tarvitset tietää onnistuiko promise. Miten saat tuloksen ilman then-ketjua?

## Tilanne

Kehittäjä yrittää finally-lohkossa tietää onnistuiko operaatio:

```javascript
await fetch(url)
  .finally((result) => {
    if (result.ok) logSuccess(); // EI TOIMI
  });
```

finally ei saa fulfillment/rejection-arvoa parametrina.

## Ratkaisu

**Tallenna flag then/catchissa — finally ei saa tulosta:**

```javascript
let success = false;
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fail");
  success = true;
  return await res.json();
} catch (err) {
  success = false;
  throw err;
} finally {
  logOutcome(success);
  hideSpinner();
}
```

Tai erilliset then/catch handlerit ilman finally-tulostarvetta.

## Käytännössä

finally on vain cleanupille — ei päätöksenteolle. Jos tarvitset tuloksen, käytä try/catch tai .then/.catch ennen finallyä. Promise.allSettled antaa status per promise.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
