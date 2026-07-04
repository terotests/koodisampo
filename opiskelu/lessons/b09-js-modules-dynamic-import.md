# Raskas chart-kirjasto tarvitaan vain admin-sivulla — haluat pienentää initial bundlea. Lataus?

## Tilanne

Performance-budget rikkoutuu: initial JS yli 500 KB. Suurin chunk sisältää Chart.js:n, vaikka se tarvitaan vain `/admin/reports`-reitillä.

```javascript
// ReportsPage.js — staattinen import
import Chart from 'chart.js/auto';
export function ReportsPage() { /* render chart */ }
```

Lighthouse: "Reduce unused JavaScript".

## Ratkaisu

**Dynamic import()** — code splitting lazy load pienentää initial bundlea:

```javascript
// ReportsPage.js
let Chart;

export async function ReportsPage(container, data) {
  if (!Chart) {
    ({ default: Chart } = await import('chart.js/auto'));
  }
  new Chart(container, { type: 'pie', data });
}
```

Initial bundle ei sisällä chart-kirjastoa — erillinen chunk latautuu admin-sivun avauksessa.

## Käytännössä

Mittaa ennen/jälkeen `webpack-bundle-analyzer` tai Vite rollup visualizer. Prefetch admin-chunkia kirjautuneille admineille loginin jälkeen. Skeleton UI odotuksen ajaksi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
