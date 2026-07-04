# Deep copy state Redux-storeen JSON.parse(JSON.stringify(obj)) — Date muuttuu stringiksi. Parempi?

## Tilanne

Redux-reducer kopioi tilan ennen päivitystä:

```javascript
const nextState = JSON.parse(JSON.stringify(state));
nextState.user.lastLogin = new Date();
console.log(typeof nextState.user.lastLogin); // "string"
```

API-vastauksen Date-kentät, Map-rakenteet ja `undefined`-arvot katoavat tai muuttuvat.

## Ratkaisu

Parempi: **structuredClone(obj) — tukee Date, Map, ArrayBuffer**:

```javascript
const nextState = structuredClone(state);
nextState.user.lastLogin = new Date();
console.log(nextState.user.lastLogin instanceof Date); // true
```

## Käytännössä

Immutability-kirjastot (Immer) ovat usein käytännöllisempiä kuin manuaalinen deep clone. `structuredClone` ei kloonaa funktioita eikä DOM-nodeja. Fallback vanhoille selaimille: polyfill tai lodash cloneDeep.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
