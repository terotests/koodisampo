# WeakSet vs Set objektiavainten jäljitykseen DOM-nodeille?

## Tilanne

Seurataan, onko DOM-node jo alustettu pluginilla:

```javascript
const initialized = new Set();
function init(node) {
  if (initialized.has(node)) return;
  initialized.add(node);
  // ...
}
```

Node poistuu DOM:sta, mutta Set pitää sen elossa — memory leak.

## Ratkaisu

**WeakSet ei estä GC:tä — node voi vapautua**:

```javascript
const initialized = new WeakSet();
function init(node) {
  if (initialized.has(node)) return;
  initialized.add(node);
}
```

## Käytännössä

WeakSet on Set ilman iterointia — vain membership-testi. Sama kuin WeakMap mutta ilman arvoa. Explicit `initialized.delete(node)` Setissä toimii, mutta vaatii muistamisen unmountissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
