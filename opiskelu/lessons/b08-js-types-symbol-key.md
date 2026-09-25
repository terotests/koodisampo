# Haluat piilottaa objektin sisäisen avaimen for-in loopilta mutta käyttää sitä metodissa. Avaintyyppi?

## Tilanne

Data-luokka tarvitsee sisäisen tilan, jota ulkopuolinen koodi ei saa nähdä iteroinneissa:

```javascript
class DataStore {
  constructor() {
    this.items = [];
    this._internalVersion = 1; // näkyy for-in loopissa!
  }
}

const store = new DataStore();
for (const key in store) {
  console.log(key); // 'items', '_internalVersion'
}
```

Alaviiva-prefix `_internal` on vain konventio — se ei piilota mitään. JSON-serialisointi ja `Object.keys` paljastavat kentän silti.

## Ratkaisu

**Symbol('internal') — for-in ja Object.keys ohittavat symboliavaimet:**

```javascript
const INTERNAL = Symbol('internal');

class DataStore {
  constructor() {
    this.items = [];
    this[INTERNAL] = { version: 1, dirty: false };
  }

  markDirty() {
    this[INTERNAL].dirty = true;
    this[INTERNAL].version++;
  }

  getVersion() {
    return this[INTERNAL].version;
  }
}

const store = new DataStore();
for (const key in store) {
  console.log(key); // vain 'items'
}
```

## Käytännössä

Huomaa: symboliavaiminen property on silti enumerable (`Object.getOwnPropertyDescriptor(store, INTERNAL).enumerable === true`). Se piiloutuu, koska for-in, `Object.keys` ja `JSON.stringify` käsittelevät vain merkkijonoavaimia.

Symbol-avaimet eivät ole salattuja — `Object.getOwnPropertySymbols()` paljastaa ne. Yksityisiin kenttiin modernissa koodissa käytä `#privateField` (class private fields) tai WeakMap:ia.

Symbol sopii kirjastojen sisäiseen metadataan, kun et halua muokata objektin julkista muotoa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
