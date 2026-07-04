# Mittaat koodin keston tarkasti — Date.now() vs performance.now()?

## Tilanne

Mittaat funktion suorituskykyä:

```javascript
const start = Date.now();
heavyWork();
console.log(Date.now() - start);
```

Tulokset hyppivät ja voivat mennä negatiiviseksi, jos järjestelmän kelloa siirretään (NTP-synk).

## Ratkaisu

**performance.now() korkeampi resoluutio monotonic**:

```javascript
const start = performance.now();
heavyWork();
console.log(performance.now() - start); // ms, sub-ms tarkkuus
```

## Käytännössä

`performance.now()` on suhteellinen page load -hetkeen, ei wall clock. `performance.mark/measure` User Timing API:hin. Node: `import { performance } from "node:perf_hooks"`. Älä käytä `Date.now()` benchmarkiin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
