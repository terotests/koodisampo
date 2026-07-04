# Käyttäjä vaihtaa sivua ennen fetchin valmistumista — vanha vastaus ylikirjoittaa uuden. Korjaus?

## Tilanne

React Router -sovelluksessa detail-sivu hakee tuotetiedot mountissa. Käyttäjä navigoi listaan ennen vastauksen saapumista. Vanha fetch päivittää statea ja listanäkymä näyttää hetken yksittäisen tuotteen tiedot — sitten flashaa oikeaan listaan.

QA merkitsee bugin kriittiseksi.

## Ratkaisu

**AbortController — signal fetchiin, abort navigoinnissa:**

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/product/${id}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setProduct)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });

  return () => controller.abort();
}, [id]);
```

Cleanup-funktio aborttaa pyynnön kun id vaihtuu tai komponentti unmountataan.

## Käytännössä

React Strict Mode mountaa kahdesti devissä — abort cleanup on tärkeä. React Router loaderit ja TanStack Query hoitavat abortin puolestasi. Testaa nopea navigointi E2E-testeillä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
