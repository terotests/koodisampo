# Funktio saa `data` joka voi olla array tai array-like. Luotettava tarkistus?

## Tilanne

Utility-funktio käsittelee DOM NodeListin tai taulukon:

```javascript
function process(data) {
  if (typeof data === 'object') {
    data.forEach(item => save(item)); // kaatuu jos data on tavallinen objekti
  }
}
```

`typeof []` on `'object'` — se ei erota taulukkoa. `instanceof Array` toimii useimmiten, mutta iframe-kontekstissa eri windowin taulukko voi epäonnistua. `Array.isArray` on luotettavin tapa.

## Ratkaisu

**Array.isArray(data)** tunnistaa oikeat taulukot:

```javascript
function process(data) {
  if (Array.isArray(data)) {
    data.forEach(item => save(item));
    return;
  }
  // Array-like (NodeList, arguments): muunna taulukoksi
  if (data && typeof data.length === 'number') {
    Array.from(data).forEach(item => save(item));
  }
}
```

`Array.isArray` toimii cross-realm — toisin kuin `instanceof Array`.

## Käytännössä

Array-like objekteilla (NodeList, HTMLCollection) käytä `Array.from()` tai spread `[...nodeList]`. `Array.isArray` on ES5-ominaisuus ja tuettu kaikkialla.

MDN suosittelee `Array.isArray` `instanceof Array` sijaan kirjastoissa ja jaetussa koodissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
