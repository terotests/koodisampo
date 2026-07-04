# Bundleri säilyttää kuolleen koodin side-effect funktiossa. Annotaatio?

## Tilanne

Util-funktio kutsuu rekisteröintiä, mutta sitä ei käytetä:

```javascript
// analytics.js
function registerEvent(name) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name });
}

export function trackPageView() {
  registerEvent('pageview');
}

// app.js — trackPageView poistettu refaktoroinnissa
// mutta registerEvent jää bundleriin koska side-effect
```

Tree-shaking ei poista `registerEvent`-kutsua, koska bundler ei tiedä onko funktiolla sivuvaikutuksia.

## Ratkaisu

**`/* @__PURE__ */`** -annotaatio tai **`sideEffects`** package.json:ssa:

```javascript
// analytics.js
/* @__PURE__ */ function registerEvent(name) {
  window.dataLayer.push({ event: name });
}
```

Rollup/Terser tulkitsee puhtaan funktion — kuollut koodi poistuu. Vaihtoehto:

```json
// package.json
"sideEffects": false
```

(koko paketti puhtaita moduleja) tai listaa tiedostot joissa on sivuvaikutuksia.

## Käytännössä

`@__PURE__` vain funktioille ilman sivuvaikutuksia — väärä käyttö rikkoo analyticsin prodissa. Webpack 5 + Terser tukee annotaatiota. Testaa prod-buildin koko ennen/jälkeen.

[Lue lisää](https://webpack.js.org/guides/tree-shaking/)
