# Käyttäjä kirjoittaa hakukenttään nopeasti — vanhemmat fetch-vastaukset saapuvat myöhemmin ja ylikirjoittavat uudemman tuloksen. Korjaus?

## Tilanne

Hakukenttä debouncee 300 ms, mutta käyttäjät valittavat silti väärät tulokset. Ongelma: debounce estää liikaa pyyntöjä, mutta hidas vastaus hakusanalle "java" saapuu myöhemmin kuin nopea vastaus "javascript"-haulle — vanha tulos ylikirjoittaa uuden.

Klassinen race condition debouncen kanssa.

## Ratkaisu

**AbortController per uusi haku + debounce:**

```javascript
let controller;
const search = debounce(async (query) => {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch(`/api/search?q=${query}`, {
      signal: controller.signal,
    });
    setResults(await res.json());
  } catch (err) {
    if (err.name !== "AbortError") throw err;
  }
}, 300);
```

Debounce vähentää pyyntöjä; abort peruuttaa vanhentuneet.

## Käytännössä

Debounce alone ei riitä — aina abort tai request sequence number. React Query ja SWR hoitavat tämän automaattisesti. Testaa nopealla kirjoituksella + throttled network DevToolsissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
