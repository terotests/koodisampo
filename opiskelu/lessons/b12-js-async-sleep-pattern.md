# Testissä haluat odottaa 100ms ilman busy-waitiä. Pattern?

## Tilanne

Integraatiotestissä haluat odottaa 100 ms että taustajono ehtii käsitellä viestin — ilman busy-wait-silmukkaa joka syö CPU:ta:

```javascript
// VÄÄRIN
const start = Date.now();
while (Date.now() - start < 100) {}
```

## Ratkaisu

**await new Promise(r => setTimeout(r, 100)):**

```javascript
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await sleep(100);
// jatka testiä
```

Event loop vapautuu odotuksen ajaksi — ei CPU-kulutusta.

## Käytännössä

Testeissä harkitse fake timers (jest.useFakeTimers) determinismiin. Tuotannossa sleep on harvoin oikea ratkaisu — backoff/retry on eri asia. Node 16+: `import { setTimeout } from 'node:timers/promises'; await setTimeout(100)`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
