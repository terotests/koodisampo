# ES proposal: import ajetaan vasta kun binding käytetään?

## Tilanne

Raskas moduuli importataan, mutta käytetään harvoin:

```javascript
// app.js
import { heavyCompute } from './heavy.js'; // evaluoidaan heti bootissa

function onRareClick() {
  heavyCompute(); // käytetään 0.1 % sessioista
}
```

Staattinen import lataa ja evaluoi `heavy.js` aina — hidastaa initial loadia.

## Ratkaisu

**`import defer`** (TC39 proposal) — delayed evaluation:

```javascript
// app.js — tuleva syntaksi
import defer { heavyCompute } from './heavy.js';

function onRareClick() {
  heavyCompute(); // vasta nyt heavy.js evaluoidaan
}
```

Moduuli parsitaan, mutta suoritus viivästyy ensimmäiseen binding-käyttöön — nopeampi boot, lazy semantics staattisella syntaksilla.

## Käytännössä

Proposal ei ole vielä laajasti tuettu (2026). Tänään: `await import('./heavy.js')` dynamic import. Seuraa TC39 proposal-import-defer. Bundlerit voivat simuloida defer-logiikkaa code splittingillä.

[Lue lisää](https://github.com/tc39/proposal-import-defer)
