# Fetch-ketju — haluat cleanup riippumatta success/failure. Mitä käytät?

## Tilanne

Data-lataus näyttää spinnerin fetchin alussa ja piilottaa sen onnistuessa. Virhetilanteessa kehittäjä kopioi piilotuskoodin catch-lohkoon — mutta unohtaa erään error-polun, ja spinner jää pyörimään.

Duplikaattinen cleanup on hauras ja vaikea ylläpitää.

## Ratkaisu

**finally() ajetaan aina kun promise settle — riippumatta tuloksesta:**

```javascript
showSpinner();
fetch("/api/data")
  .then((res) => res.json())
  .then(renderData)
  .catch(showError)
  .finally(() => hideSpinner());
```

Async/await:

```javascript
showSpinner();
try {
  const res = await fetch("/api/data");
  renderData(await res.json());
} catch (err) {
  showError(err);
} finally {
  hideSpinner();
}
```

## Käytännössä

finally ei saa parametreja eikä muuta promise-ketjun arvoa. Älä laita finallyyn async-logiikkaa, joka voi failata — pidä se yksinkertaisena cleanupina. DB-yhteyksien sulkeminen, spinner, lock release → finally.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
