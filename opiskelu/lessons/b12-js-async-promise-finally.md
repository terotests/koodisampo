# Latausnäkymä pitää piilottaa sekä onnistumisessa että virheessä. Mikä Promise-metodi?

## Tilanne

Latausnäkymä näyttää overlay-spinnerin fetchin aikana. Onnistuessa piilotetaan spinner ja näytetään data. Virheessä piilotetaan spinner ja näytetään virhe — mutta eräs error-polku unohtuu ja spinner jää päälle.

## Ratkaisu

**finally(() => hideSpinner()) — ajetaan aina settled-tilassa:**

```javascript
showSpinner();
try {
  const res = await fetch("/api/data");
  if (!res.ok) throw new Error("HTTP error");
  render(await res.json());
} catch (err) {
  showError(err);
} finally {
  hideSpinner();
}
```

Tai promise-ketjussa: `.finally(() => hideSpinner())`.

## Käytännössä

finally ei saa onnistumis-/virhetietoa parametrina — tallenna flag erikseen jos tarvitset. Älä throw finallyssä ellei pakko. Loading state -hookit (useAsync) hoitavat tämän automaattisesti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
