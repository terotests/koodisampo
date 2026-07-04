# API palauttaa tuntematonta JSON-dataa TypeScriptissä. Miksi `unknown` on turvallisempi kuin `any`?

## Tilanne

Integraatiorajapinta palauttaa ulkoisen palvelun vastauksen suoraan `response.json()`:sta. Kehittäjä merkitsee datan `any`:ksi, jotta koodi kääntyy nopeasti:

```typescript
async function fetchPayload(): Promise<any> {
  const res = await fetch('/api/external');
  return res.json();
}

const data = await fetchPayload();
console.log(data.user.email.toLowerCase()); // ei virheitä käännöksessä
```

Tuotannossa vastaus on joskus `{ error: "timeout" }` ilman `user`-kenttää. Runtime kaatuu, vaikka TypeScript antoi vihreää valoa — `any` poistaa kaiken tyyppitarkistuksen.

## Ratkaisu

**unknown pakottaa tarkistamaan tai kaventamaan tyypin ennen käyttöä**:

```typescript
async function fetchPayload(): Promise<unknown> {
  const res = await fetch('/api/external');
  return res.json();
}

const data = await fetchPayload();

// Virhe: Property 'user' does not exist on type 'unknown'
// console.log(data.user);

function isUserPayload(x: unknown): x is { user: { email: string } } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'user' in x &&
    typeof (x as { user: unknown }).user === 'object'
  );
}

if (isUserPayload(data)) {
  console.log(data.user.email.toLowerCase()); // turvallista
}
```

`unknown` on type-safe top type: voit siihen assignoida mitä tahansa, mutta et käytä sitä ennen narrowingia. `any` ohittaa koko tarkistuksen.

## Käytännössä

JSON-parsinnassa, lomakkeiden arvoissa ja plugin-rajapinnoissa käytä `unknown` oletuksena — pakota validointi (type guard, Zod, io-ts) yhteen paikkaan. `any` on ok vain legacy-refaktoroinnin väliaikaisessa rajauksessa, ei uudessa koodissa. `strict` + `unknown` estää "toimii devissä, kaatuu prodissa" -luokan virheet.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
