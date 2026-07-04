# Raskas chart-kirjasto vain admin-sivulla — bundle liian iso. Latausstrategia?

## Tilanne

Tuotanto-buildin initial JS on 1.2 MB. Suurin syyllinen on Chart.js admin-dashboardissa, jota käytetään harvoin:

```javascript
// admin/charts.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

Staattinen import vetää chart-kirjaston pääbundleen.

## Ratkaisu

**Dynamic import()** — code splitting route- tai komponenttitason mukaan:

```javascript
// admin/charts.js
export async function mountChart(el, data) {
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);
  return new Chart(el, { type: 'line', data });
}
```

Reitillä:

```javascript
{ path: '/admin/stats', component: () => import('./admin/StatsPage.js') }
```

## Käytännössä

Initial bundle pienenee — chart-chunk latautuu admin-sivun avauksessa. Lisää loading-tila. Tarkista Network-välilehdeltä että chunk ei lataudu etusivulla.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
