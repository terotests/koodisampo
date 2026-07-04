# JSON.stringify(BigInt(42)) heittää TypeError. Miksi?

## Tilanne

Lokitus middleware yrittää serialisoida pyynnön metadatan:

```javascript
const logEntry = {
  userId: BigInt('9007199254740993'),
  action: 'login',
};

JSON.stringify(logEntry);
// TypeError: Do not know how to serialize a BigInt
```

BigInt lisättiin JavaScriptiin ES2020:ssa, mutta JSON-spesifikaatio ei tunne BigInt-tyyppiä. `JSON.stringify` osaa käsitellä vain JSON-spesifikaation tyypit: string, number, boolean, null, array ja object.

## Ratkaisu

**JSON ei tue BigInt-serialisointia natiivisti — custom replacer tai string** — valitse strategia:

```javascript
// Vaihtoehto 1: serialisoi stringiksi replacerilla
JSON.stringify(logEntry, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
);

// Vaihtoehto 2: muunna ennen stringifyä
const safe = {
  ...logEntry,
  userId: logEntry.userId.toString(),
};

// Vaihtoehto 3: globalBigInt support (Node 20.7+ / modern browsers)
// BigInt.prototype.toJSON = function() { return this.toString(); };
```

## Käytännössä

API-rajapinnoissa 64-bit ID:t kannattaa pitää merkkijonoina JSONissa — se välttää sekä stringify- että parse-ongelmat. `BigInt.prototype.toJSON` on kätevä, mutta muokkaa globaalia prototyyppiä — harkitse replaceria kirjastossa.

MDN JSON.stringify dokumentoi replacer-funktion käytön.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
