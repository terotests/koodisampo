# Web Worker postMessage hidastuu — suuri ArrayBuffer kopioidaan joka viestissä. Optimointi?

## Tilanne

Data-visualisointi lähettää 50 MB:n `ArrayBuffer`:n Web Workerille joka sekunti. DevTools Memory-näkymässä heap kasvaa, ja viestien lähetys hidastuu selvästi.

```javascript
worker.postMessage({ buffer: bigBuffer });
// structured clone kopioi koko bufferin joka kerta
```

Ilman transfer listiä selain kopioi bufferin pääsäikeestä workeriin — kallista sekä CPU:lla että muistilla.

## Ratkaisu

Käytä **postMessage(buffer, [buffer]) transfer list — omistajuuden siirto**:

```javascript
worker.postMessage({ buffer: bigBuffer }, [bigBuffer]);
// bigBuffer on nyt tyhjä pääsäikeessä — omistajuus siirtyi
```

Transfer siirtää omistajuuden kopioimatta dataa.

## Käytännössä

Transfer on yksisuuntainen: lähettäjä menettää bufferin. Worker voi transferoida takaisin samalla tavalla. `SharedArrayBuffer` sopii jaettuun muistitilaan, mutta vaatii cross-origin isolation -headerit.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
