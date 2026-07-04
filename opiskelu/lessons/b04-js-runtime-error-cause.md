# fetch wrapper heittää uuden Error('API failed') — alkuperäinen stack katoaa. ES2022 parannus?

## Tilanne

Fetch-wrapper normalisoi virheet:

```javascript
async function apiGet(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    throw new Error("API failed");
  }
}
```

Tuotantolokeissa näkyy vain "API failed" ilman HTTP-statuskoodia tai alkuperäistä stackia.

## Ratkaisu

ES2022 parannus: **throw new Error('API failed', { cause: originalError })**:

```javascript
} catch (e) {
  throw new Error("API failed", { cause: e });
}
console.error(err.cause); // alkuperäinen HTTP-virhe
```

## Käytännössä

Lisää konteksti viestiin (`API failed: GET /users`) ja säilytä cause diagnostiikkaan. OpenTelemetry ja Sentry käyttävät cause-ketjua automaattisesti kun konfiguroitu.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error#options)
