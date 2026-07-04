# Feature flag lataa analytics-moduulin vain tarvittaessa. ES module tapa?

## Tilanne

Tuotannossa analytics on pois päältä useimmille käyttäjille, mutta kehityksessä päällä. Staattinen import lataa moduulin aina:

```javascript
// app.js
import { track } from './analytics.js'; // 80 KB aina mukana

if (window.FEATURE_ANALYTICS) {
  track('pageview');
}
```

Bundleri ei voi poistaa `./analytics.js`:ää, koska import on staattinen — feature flag on vain runtime-ehto.

## Ratkaisu

**Dynamic import()** feature flagin takana:

```javascript
// app.js
async function initAnalytics() {
  if (!window.FEATURE_ANALYTICS) return;

  const { track } = await import('./analytics.js');
  track('pageview');
}

initAnalytics();
```

Moduuli latautuu ja evaluoidaan vasta kun ehto täyttyy — bundler voi erottaa sen omaksi chunkiksi.

## Käytännössä

Kääri kutsu try/catchiin — verkko- tai CSP-virhe ei kaada koko appia. Feature flag voi tulla myös serveriltä ennen dynamic importia. Sama pattern toimii A/B-testeihin ja kolmannen osapuolen SDK:ihin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
