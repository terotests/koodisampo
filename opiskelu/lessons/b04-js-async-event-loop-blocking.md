# UI jäätyy kun käsittelet 100k rivin CSV:tä for-silmukalla fetchin jälkeen. Ensimmäinen korjaus?

## Tilanne

Admin-paneeli lataa 100 000 rivin CSV-tiedoston fetchillä ja parsii sen for-silmukalla:

```javascript
const text = await response.text();
const rows = text.split("\n");
for (const row of rows) {
  processRow(row); // raskas synkroninen työ
}
```

UI jäätyy kokonaan parsinnin ajaksi — spinner ei edes pyöri, koska event loop on blokattu.

## Ratkaisu

**Pilko työ chunkkeihin tai siirrä Web Workeriin:**

```javascript
// Chunkkaus — antaa event loopin hengittää
async function processInChunks(rows, chunkSize = 500) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    chunk.forEach(processRow);
    await new Promise((r) => setTimeout(r, 0)); // vapauttaa event loopin
  }
}
```

Parempi: Web Worker raskaaseen parsintaan — UI-säie pysyy responsiivisena.

## Käytännössä

Async/await ei tee synkronisesta työstä non-blocking. Jos silmukka kestää >50 ms, UI tuntuu jähmettyneeltä. Mittaa Performance API:lla. CSV/JSON >10k riviä → worker tai stream.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
