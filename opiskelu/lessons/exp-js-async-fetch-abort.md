# Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — state päivittyy unmountatulle komponentille. Miten estät?

## Tilanne

React-dashboard hakee tilastot `useEffect`-hookissa. Käyttäjä navigoi pois ennen kuin hidas API vastaa. Kun vastaus saapuu, `setStats(data)` kutsutaan unmountatulle komponentille — React varoittaa memory leakistä ja näyttö päivittyy väärään sivuun.

Ongelma toistuu erityisesti mobiilissa, jossa käyttäjät vaihtavat välilehteä nopeasti.

## Ratkaisu

**AbortController + cleanup useEffectin returnissa.**

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/stats", { signal: controller.signal })
    .then((res) => res.json())
    .then(setStats)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });

  return () => controller.abort();
}, []);
```

Abort peruuttaa fetch-pyynnön ja estää callbackin ajamisen navigoinnin jälkeen.

## Käytännössä

Tee abortista oletus kaikissa data-fetch useEffecteissä. React 19:n `use()` ja Suspense muuttavat mallia, mutta AbortController on edelleen oikea tapa peruuttaa pyyntö. Ignoroi `AbortError` catchissa — se on odotettu.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
