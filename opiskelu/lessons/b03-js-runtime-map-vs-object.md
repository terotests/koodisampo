# Cache avaimena objekti-instanssi — Object keys eivät toimi odotetusti. Rakenne?

## Tilanne

Cache käyttää objekti-instanssia avaimena:

```javascript
const cache = {};
const key = { id: 1 };
cache[key] = "result";
console.log(cache[{ id: 1 }]); // undefined — avain on "[object Object]"
```

Objektit stringifioituvat avaimiksi, joten eri instanssit eivät osuma.

## Ratkaisu

Käytä **Map — mikä tahansa arvo avaimena, .size, iteration järjestyksessä**:

```javascript
const cache = new Map();
const key = { id: 1 };
cache.set(key, "result");
console.log(cache.get(key)); // "result"
```

## Käytännössä

Map säilyttää insert-järjestyksen ja tarjoaa `.size`. Object sopii string-avaimille ja JSON-serialisointiin. WeakMap kun avain on objekti eikä saa estää GC:tä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
