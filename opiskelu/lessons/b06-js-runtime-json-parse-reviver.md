# JSON.parse palauttaa date stringit — haluat Date-objekteja automaattisesti. Miten?

## Tilanne

API palauttaa päivämäärät ISO-stringeinä:

```javascript
const data = JSON.parse('{"createdAt":"2026-07-04T10:00:00Z"}');
data.createdAt.getFullYear(); // TypeError — string, ei Date
```

Manuaalinen muunnos jokaisessa kentässä on virhealtista.

## Ratkaisu

**JSON.parse(text, reviver) — reviver muuntaa parsatut arvot kuten Date-objektit**:

```javascript
const data = JSON.parse(json, (key, value) => {
  if (typeof value === "string" && /^d{4}-d{2}-d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
});
```

## Käytännössä

Reviver ajetaan syvyyssuunnassa alhaalta ylös. Zod/io-ts validoi ja muuntaa tyypitetysti — parempi kuin ad hoc regex. `JSON.stringify` replacer on vastine serialisointiin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
