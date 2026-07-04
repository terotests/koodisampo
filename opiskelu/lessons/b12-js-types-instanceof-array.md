# Miksi `[] instanceof Object` on true mutta Array.isArray suositeltu?

## Tilanne

Validointifunktio tarkistaa onko syöte taulukko:

```javascript
function validate(data) {
  if (data instanceof Object) {
    // [] pääsee tänne — se ON Object
    processArray(data); // voi kaatua jos data on tavallinen objekti
  }
}
```

Kaikki taulukot ovat objekteja JavaScriptissä — `[] instanceof Object` on `true`. Mutta `instanceof Array` ei toimi luotettavasti, jos taulukko on luotu eri iframe- tai realm-kontekstissa (esim. Node.js worker, selain-extension).

## Ratkaisu

**instanceof ei erota arraya cross-realm / iframe kontekstissa luotavasta** — `Array.isArray` on spec-määrityksen mukainen:

```javascript
Array.isArray([]);           // true
Array.isArray({});           // false
Array.isArray('not array');  // false
Array.isArray(null);         // false

// Cross-realm esimerkki (iframe):
const iframeArray = iframe.contentWindow.eval('[1,2,3]');
iframeArray instanceof Array;     // false — eri realm!
Array.isArray(iframeArray);       // true — luotettava
```

## Käytännössä

Käytä `Array.isArray` aina kun tarkistat onko arvo taulukko. `instanceof Array` sopii vain, kun tiedät varmasti saman realm-kontekstin.

MDN ja TypeScript dokumentaatio suosittelevat `Array.isArray`. Se on ES5-ominaisuus ja nopea.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
