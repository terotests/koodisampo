# Cacheta metadata DOM-elementeille ilman että estät GC:n poistamasta elementtejä. Rakenne?

## Tilanne

Tooltip-kirjasto cachettaa elementtikohtaiset asetukset. Map kasvaa rajatta, koska poistetuista elementeistä ei kutsuta `delete`.

## Ratkaisu

**WeakMap — avaimet voivat kerätä roskikseen ilman explicit deletea**:

```javascript
const tooltips = new WeakMap();
function bind(el, options) {
  tooltips.set(el, options);
}
```

## Käytännössä

WeakMap on ideaalinen kun metadata elää vain niin kauan kuin DOM-node. Globaaliin LRU-cacheen tarvitaan Map + TTL. Dokumentoi, ettei WeakMap:ia voi serialisoida tai iteroida.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
