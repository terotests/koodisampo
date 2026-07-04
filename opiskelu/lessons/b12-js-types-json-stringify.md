# API lähettää objektin HTTP-bodyna. Miten muunnat JS-objektin JSON-merkkijonoksi?

## Tilanne

Frontend lähettää lomakedatan REST API:in:

```javascript
const payload = { name: 'Maija', email: 'maija@example.com' };

await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: ??? // miten objekti muutetaan HTTP-bodyksi?
});
```

HTTP-body on merkkijono (tai binääri). JavaScript-objekti ei serialisoidu automaattisesti — `fetch` ei kutsu `JSON.stringify`:ä puolestasi.

## Ratkaisu

**JSON.stringify(obj)** muuntaa JavaScript-arvon JSON-muotoon:

```javascript
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

Vastauksen deserialisointi:

```javascript
const response = await fetch('/api/users/1');
const user = await response.json(); // JSON.parse wrapper
```

## Käytännössä

`JSON.stringify` hyväksyy replacer-funktion ja sisennyksen: `JSON.stringify(obj, null, 2)` debug-tulostukseen. Se ei serialisoi `undefined`-kenttiä, funktioita, Symbol-avaimia tai BigInt:iä.

MDN: muista asettaa `Content-Type: application/json` header — muuten backend ei välttämättä parsaa bodya.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
