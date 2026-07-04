# Cache viittaa isoihin objekteihin ja estää GC:n vaikka UI on vapauttanut ne. Etenevä ratkaisu?

## Tilanne

Kuva-cache pitää suuria ImageBitmap-objekteja Map:issa. UI navigoi pois, mutta cache estää GC:n — muisti pysyy korkeana tuntikausia.

## Ratkaisu

Etenevä ratkaisu: **WeakRef + FinalizationRegistry — ei pidä objektia elossa**:

```javascript
const cache = new Map();
function getBitmap(key, factory) {
  const ref = cache.get(key);
  const bmp = ref?.deref();
  if (bmp) return bmp;
  const fresh = factory();
  cache.set(key, new WeakRef(fresh));
  return fresh;
}
```

## Käytännössä

WeakRef.deref() voi palauttaa undefined milloin tahansa GC:n jälkeen. FinalizationRegistry siivoaa Map-merkinnät. LRU + max size on usein yksinkertaisempi kuin WeakRef tuotannossa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
