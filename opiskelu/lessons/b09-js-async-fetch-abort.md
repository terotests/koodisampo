# Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — haluat peruuttaa pyynnön. API?

## Tilanne

Käyttäjä avaa tuotteen, navigoi pois 200 ms:ssä. Hidas API-vastaus saapuu 3 sekunnin kuluttua ja React varoittaa state-päivityksestä unmountatulle komponentille. Memory leak -varoituksia kertyy dev-konsolissa.

## Ratkaisu

**AbortController + signal fetch-kutsussa:**

```javascript
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      setData(await res.json());
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    }
  }
  load();

  return () => controller.abort();
}, [url]);
```

Navigointi/unmount kutsuu abort() — pyyntö peruutetaan selaimessa.

## Käytännössä

AbortController on fetch API:n standarditapa peruutukseen. Toimii myös axiosissa signal-parametrilla. Älä sekoita cancelled-flagia abortiin — abort on selkeämpi ja vapauttaa resurssit.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
