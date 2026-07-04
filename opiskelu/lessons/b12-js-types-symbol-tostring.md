# Object.keys() ei näytä Symbol-avaimia. Miten iteroidaan ne?

## Tilanne

Kirjasto liittää metadataa Symbol-avaimella:

```javascript
const META = Symbol('meta');
const obj = { name: 'Maija', [META]: { version: 2 } };

Object.keys(obj);        // ['name'] — META puuttuu
JSON.stringify(obj);     // '{"name":"Maija"}' — META puuttuu

// Miten pääset META-avaimeen kiinni?
```

Symbol-avaimet ovat tarkoituksella piilossa tavallisilta iteroinneilta. Ne eivät näy `for...in`, `Object.keys()` eikä JSON-serialisoinnissa — mutta ne ovat edelleen objektin omia propertyjä.

## Ratkaisu

**Object.getOwnPropertySymbols(obj)** palauttaa kaikki Symbol-avaimet:

```javascript
const symbols = Object.getOwnPropertySymbols(obj);
// [Symbol(meta)]

const meta = obj[symbols[0]];
console.log(meta); // { version: 2 }

// Kaikki omat avaimet (string + symbol):
Reflect.ownKeys(obj); // ['name', Symbol(meta)]
```

`Reflect.ownKeys` yhdistää `Object.getOwnPropertyNames` ja `getOwnPropertySymbols`.

## Käytännössä

Symbol-avaimet ovat harvinaisia sovelluskoodissa — ne ovat yleisempiä kirjastoissa. Jos tarvitset piilotettua metadataa omassa luokassasi, harkitse `#privateField` tai WeakMap:ia.

MDN: Symbol-avaimet eivät ole salattuja — ne ovat piilossa vain tavallisilta iteroinneilta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
