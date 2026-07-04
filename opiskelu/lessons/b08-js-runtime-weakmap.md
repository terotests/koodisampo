# DOM-elementtiin liitetty metadata — Map aiheuttaa memory leakin kun element poistuu. Rakenne?

## Tilanne

Drag-and-drop-kirjasto tallentaa jokaisen draggable-elementin tilan:

```javascript
const dragState = new Map();
dragState.set(element, { startX: 0, startY: 0 });
// element.remove() — Map pitää viittauksen
```

Pitkän session jälkeen muistiprofiili näyttää tuhansia irrotettuja elementtejä.

## Ratkaisu

**WeakMap — avaimet heikosti viitattuja, GC voi kerätä elementin**:

```javascript
const dragState = new WeakMap();
dragState.set(element, { startX: 0, startY: 0 });
```

## Käytännössä

Yhdistä WeakMap + explicit teardown (poista listenerit, peru animaatiot). WeakMap ei korvaa disposelogiikkaa — se vain estää Map-avaimen pitämästä nodea elossa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
