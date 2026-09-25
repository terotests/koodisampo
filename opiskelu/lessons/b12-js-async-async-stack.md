# Virheen stack trace katkeaa await-kohtaan debugatessa. Mikä auttaa näkemään koko async-ketjun?

## Tilanne

Tuotantobugin debuggaus: stack trace katkeaa await-kohdassa. Näet async-funktion nimen, mutta et mistä se kutsuttiin ennen awaitia — erityisesti syvässä call chainissa kolmen microservicen läpi.

## Ratkaisu

**Engine liittää await-kohdat stack traceen, DevTools näyttää async-pinon:**

Chrome DevTools: Enable "Async stack traces" → näet koko ketjun await-rajojen yli.

Node.js: V8:n "zero-cost" async stack traces ovat oletuksena päällä Node 12:sta alkaen — `Error.stack` sisältää `at async ...` -rivit await-rajojen yli. Transpiloidussa koodissa lisää source mapit:

```bash
node --enable-source-maps app.js
```

`async_hooks` ei korjaa stack traceja — se on matalan tason diagnostiikka-API, jota ei tarvita tähän.

## Käytännössä

Source mapit tuotantolokeihin (Sentry, Datadog) palauttavat luettavat stackit. Vältä liian syviä await-ketjuja — refaktoroi väliin nimettyjä funktioita. Error.cause ketjuttaa virheet selkeästi.

[Lue lisää](https://developer.chrome.com/docs/devtools/javascript/reference/#async-stack)
