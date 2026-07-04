# Cache Map DOM-elementeistä aiheuttaa memory leakin sivun vaihtuessa. Parempi rakenne?

## Tilanne

Komponenttikirjasto liittää jokaiseen DOM-elementtiin private-tilan Map:issa. Kun SPA navigoi pois, elementit poistuvat DOM:sta mutta Map pitää ne elossa — DevTools näyttää detached nodeja.

## Ratkaisu

Parempi rakenne: **WeakMap — avaimet voivat GC:tä ilman explicit delete-kutsua**:

```javascript
const privateData = new WeakMap();
export function init(el) {
  privateData.set(el, { mounted: true });
}
```

## Käytännössä

WeakMap on standardiratkaisu "private fields" -tyyppiseen dataan ennen #private-syntaksia. Muista silti poistaa globaalit listenerit. `WeakMap` ei serialisoidu JSON:iin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
