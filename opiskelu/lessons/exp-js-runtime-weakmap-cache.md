# DOM-elementtiin liitetty metadata aiheuttaa memory leakin Mapissa. Parempi rakenne?

## Tilanne

UI-kirjasto tallentaa jokaisen DOM-elementin metadatan (tooltip-sijainti, drag-tila) Map-rakenteeseen:

```javascript
const metadata = new Map();
metadata.set(element, { offsetX: 10, dragging: false });
```

Kun komponentti poistaa elementin DOM:sta, metadata jää Map:iin. Chrome DevTools näyttää "detached DOM tree" -nodeja, ja muisti ei vapaudu.

## Ratkaisu

Vaihda **WeakMap — objektiavain ei estä elementin roskienkeruuta**:

```javascript
const metadata = new WeakMap();
metadata.set(element, { offsetX: 10, dragging: false });
// Kun element GC:tään, merkintä katoaa automaattisesti
```

## Käytännössä

WeakMap ei ole iterointikelpoine eikä paljasta avaimia — sopii liitettyyn metadataan, ei globaaliin cacheen. Poista silti event listenerit teardownissa; WeakMap ei korvaa listener-cleanupia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
