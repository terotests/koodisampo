# SPA:n muisti kasvaa navigoidessa — DevTools näyttää detached DOM -nodeja. Syy?

## Tilanne

Single-page-sovellus kasvattaa heapia jokaisella reittivaihdolla. Chrome Memory snapshotissa näkyy "Detached HTMLElement" -ketjuja, jotka viittaavat vanhoihin näkymiin.

Kuuntelijat rekisteröidään mountissa mutta eivät poistu unmountissa. Closure pitää viittauksen DOM-puuhun.

## Ratkaisu

Syy: **Event listenerit tai closuret pitävät viittauksia poistettuihin DOM-elementteihin**:

```javascript
// Korjaus: cleanup
return () => {
  observer.disconnect();
  element.removeEventListener("click", handler);
  largeData = null;
};
```

## Käytännössä

Performance → Memory → "Collect garbage" ennen vertailua. WeakMap metadataan, explicit cleanup listenerille. React Strict Mode ajaa effectit kahdesti kehityksessä — paljastaa puuttuvan cleanupin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
