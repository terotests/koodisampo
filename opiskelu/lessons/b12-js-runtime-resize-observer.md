# CSS grid resize — haluat mitata elementin koon muutokset. API?

## Tilanne

Responsiivinen dashboard mittaa containerin leveyttä `window.resize`:llä, mutta sidebarin collapse muuttaa grid-area:n kokoa ilman ikkunan koon muutosta — kaaviot eivät skaalaudu.

## Ratkaisu

API: **ResizeObserver**:

```javascript
const ro = new ResizeObserver((entries) => {
  for (const e of entries) {
    chart.resize(e.contentRect.width, e.contentRect.height);
  }
});
ro.observe(chartContainer);
```

## Käytännössä

ResizeObserver callback voi triggeröidä layoutin — debounce raskaille operaatioille. `contentBoxSize` vs `borderBoxSize` CSS-boxin mukaan. `disconnect()` unmountissa. Ei korvaa CSS container queries -ratkaisuja kaikissa tapauksissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
