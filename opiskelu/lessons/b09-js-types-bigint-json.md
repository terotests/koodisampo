# API palauttaa 64-bit ID:n — JSON.stringify heittää BigInt:illä. Ratkaisu?

## Tilanne

Event-lokitus lähettää tapahtuman API:in:

```javascript
const event = {
  type: 'purchase',
  orderId: BigInt('9223372036854775807'),
  timestamp: Date.now(),
};

await fetch('/events', {
  method: 'POST',
  body: JSON.stringify(event),
});
// TypeError: Do not know how to serialize a BigInt
```

BigInt on JavaScript-tyyppi, mutta JSON-spesifikaatio ei tunne sitä. Natiivi `JSON.stringify` kaatuu heti BigInt-kenttään törmätessään.

## Ratkaisu

**Custom replacer tai serialisoi stringiksi — JSON ei tue BigInt natiivisti:**

```javascript
function jsonSafeStringify(obj) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

// Tai muunna ennen stringifyä
const payload = {
  ...event,
  orderId: event.orderId.toString(),
};

// Deserialisointi
const revived = JSON.parse(json, (key, value) => {
  if (key === 'orderId') return BigInt(value);
  return value;
});
```

## Käytännössä

Paras ratkaisu on pitää suuret ID:t merkkijonoina koko API:ssa — stringify, parse ja frontend toimivat ilman replacereita. Jos tarvitset BigInt:iä laskennassa, muunna rajapinnassa.

MDN BigInt ja JSON.stringify dokumentoivat rajoitukset. Harkitse `BigInt.prototype.toJSON` globaalisti vain kontrolloidusti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
