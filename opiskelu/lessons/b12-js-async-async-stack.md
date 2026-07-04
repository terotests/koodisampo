# async stack trace katkeaa await-kohdassa debugissa. Node/DevTools apu?

## Tilanne

Tuotantobugin debuggaus: stack trace katkeaa await-kohdassa. Näet async-funktion nimen, mut et mistä se kutsuttiin ennen awaitia — erityisesti syvässä call chainissa kolmen microservicen läpi.

## Ratkaisu

**Modernit enginet säilyttävät async stack linkin — käytä DevTools async stack tracea:**

Chrome DevTools: Enable "Async stack traces" → näet koko ketjun await-rajojen yli.

Node.js:

```bash
node --async-stack-traces app.js
# tai Node 16+ source maps
node --enable-source-maps app.js
```

async_hooks (Node) diagnostiikkaan — ei tuotantokoodiin suoraan.

## Käytännössä

Source mapit tuotantolokeihin (Sentry, Datadog) palauttavat luettavat stackit. Vältä liian syviä await-ketjuja — refaktoroi väliin nimettyjä funktioita. Error.cause ketjuttaa virheet selkeästi.

[Lue lisää](https://developer.chrome.com/docs/devtools/javascript/reference/#async-stack)
