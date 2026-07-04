# Käyttäjä peruuttaa — haluat että hitain fetch häviää kilpajuoksussa. Metodi?

## Tilanne

Pitkä fetch ja käyttäjän "Peruuta"-nappi kilpailevat. Haluat, että ensimmäinen valmis voittaa — jos käyttäjä peruuttaa, fetch hylätään heti.

## Ratkaisu

**Promise.race([fetch(...), abortPromise]):**

```javascript
function fetchWithCancel(url, signal) {
  const abortPromise = new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  });
  return Promise.race([fetch(url, { signal }), abortPromise]);
}
```

Käytännössä AbortController fetch-signaalilla riittää useimmiten — race on explisiittinen vaihtoehto.

## Käytännössä

Promise.race voittaa ensimmäisen settle — huomaa "hylätty fetch jatkuu taustalla" ilman abort-signaalia. Yhdistä aina AbortController. Timeout: AbortSignal.timeout on siistimpi kuin race timeout-promisen kanssa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
