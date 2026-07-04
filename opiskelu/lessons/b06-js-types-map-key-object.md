# Objekti avaimena Mapissa — sama key instance löytyy. Miksi ei Object avaimella?

## Tilanne

Cache-toteutus käyttää objekteja avaimina:

```javascript
const cache = {};
const keyA = { id: 1 };
const keyB = { id: 1 };

cache[keyA] = 'data A';
console.log(cache[keyB]); // undefined — eri avain!

// Map toimii:
const map = new Map();
map.set(keyA, 'data A');
console.log(map.get(keyA)); // 'data A'
console.log(map.get(keyB)); // undefined — oikein, eri objekti
```

Tavallinen objekti muuntaa avaimen merkkijonoksi (`"[object Object]"`), joten kaikki objektiavaimet törmäävät samaan kenttään. Map sen sijaan vertaa objektiavaimia *referenssillä* — sama instanssi, sama avain.

## Ratkaisu

**Map vertaa objektiavaimia referenssillä — SameValueZero, ei sisältöä** tarkoittaa, että `{ id: 1 } !== { id: 1 }` avaimena:

```javascript
const map = new Map();
const user = { id: 42 };

map.set(user, { cached: true });
map.get(user);           // löytyy — sama referenssi
map.get({ id: 42 });     // undefined — uusi objekti

// Primitiiviavaimet vertaillaan arvolla
map.set(1, 'one');
map.set(1, 'one again'); // korvaa edellisen
```

## Käytännössä

Käytä Map:ia kun avaimet eivät ole merkkijonoja tai kun tarvitset insertion order -iteroinnin. WeakMap sopii objektikohtaiseen metadataan, joka ei estä garbage collectionia.

MDN: Map ei serialisoidu JSONiin suoraan — muunna `Array.from(map.entries())` tarvittaessa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
