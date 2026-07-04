# Metadata cache objekteille — Map pitää objektit elossa muistivuotona. Vaihtoehto?

## Tilanne

Palvelinrenderöidyn sovelluksen hydration tallentaa komponentti-instanssit Map:iin avaimena DOM-node:

```javascript
const instanceCache = new Map();
function attach(el, instance) {
  instanceCache.set(el, instance);
}
```

Navigoidessa sivulta toiselle vanhat instanssit jäävät mappiin, koska Map pitää avaimet vahvasti viitattuina.

## Ratkaisu

Vaihtoehto: **WeakMap — avaimet eivät estä objektien roskienkeruuta metadata-cachessa**:

```javascript
const instanceCache = new WeakMap();
instanceCache.set(el, instance);
// Ei tarvitse delete(el) kun node poistuu
```

## Käytännössä

WeakMap sopii "side table" -käyttöön. Jos tarvitset listan kaikista cachetetuista instansseista, WeakMap ei riitä — tarvitset erillisen rekisterin tai WeakRef-ratkaisun.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
