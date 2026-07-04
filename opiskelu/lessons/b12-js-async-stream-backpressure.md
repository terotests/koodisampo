# Node transform stream tulvii muistia — kirjoittaja nopeampi kuin lukija. Mekanismi?

## Tilanne

Node ETL-putki: transform stream muuntaa rivit JSON:sta CSV:ksi. Kirjoittaja on nopeampi kuin lukija (verkko-upload). Muisti kasvaa gigatavuihin — prosessi kaatuu OOM:iin.

## Ratkaisu

**Backpressure — stream.write() palauttaa false, odota 'drain':**

```javascript
function writeChunk(stream, chunk) {
  if (!stream.write(chunk)) {
    return new Promise((resolve) => stream.once("drain", resolve));
  }
}

async function pump(readable, writable) {
  for await (const chunk of readable) {
    await writeChunk(writable, chunk);
  }
  writable.end();
}
```

Tai `pipeline(readable, transform, writable)` — hoitaa backpressure automaattisesti.

## Käytännössä

Käytä aina stream.pipeline() uudessa koodissa — se hoitaa error propagation ja backpressure. HighWaterMark säätö harvoin tarpeen. Monitoroi muistia ETL-putkissa. Object mode streamit: eri backpressure-säännöt.

[Lue lisää](https://nodejs.org/api/stream.html#backpressure)
