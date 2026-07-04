# Raskas chart-kirjasto ladataan vain kun käyttäjä avaa analytics-sivun. Miten?

## Tilanne

Analytics-sivu käyttää Chart.js:ää, mutta etusivu importtaa sen staattisesti:

```javascript
// analytics.js
import Chart from 'chart.js/auto'; // ~200 KB

export function renderChart(canvas, data) {
  return new Chart(canvas, { type: 'bar', data });
}
```

```javascript
// router.js — analytics importataan heti
import { renderChart } from './analytics.js';
```

Käyttäjät, jotka eivät koskaan avaa analyticsia, maksavat silti kirjaston hinnan.

## Ratkaisu

**Dynamic import** code-splittingilla:

```javascript
// analytics.js
export async function renderChart(canvas, data) {
  const { default: Chart } = await import('chart.js/auto');
  return new Chart(canvas, { type: 'bar', data });
}
```

Tai reitillä:

```javascript
router.on('/analytics', async () => {
  const mod = await import('./analytics.js');
  mod.mount();
});
```

## Käytännössä

Näytä skeleton/spinner odotuksen aikana. Bundlerin chunk-nimi kannattaa nimetä (`/* webpackChunkName: "analytics" */`). Prefetch linkillä `<link rel="prefetch">` jos analytics on todennäköinen seuraava sivu.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
