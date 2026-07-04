# Stream API palauttaa async iterable — haluat loopata awaitilla. Miten?

## Tilanne

Node-palvelu lukee uploadattua tiedostoa ReadableStreamina. Kehittäjä yrittää tavallista for...of-silmukkaa, mutta chunkit ovat Promise-objekteja eikä data tule oikein.

Stream API palauttaa async iterablen — tarvitaan eri syntaksi.

## Ratkaisu

**for await...of async iterablelle:**

```javascript
for await (const chunk of readableStream) {
  processChunk(chunk);
}
```

Node-esimerkki:

```javascript
import { createReadStream } from "node:fs";

const stream = createReadStream("data.jsonl");
for await (const line of stream) {
  await processLine(line);
}
```

Jokainen iteratio odottaa seuraavan chunkin asynkronisesti.

## Käytännössä

for await vaatii async-funktion kontekstin. Muista break/return — generaattori kutsuu finally/freturn. Web Streams: `stream.values()` tai `ReadableStream` async iterator. Virheenkäsittely try/catch silmukan ympärillä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
