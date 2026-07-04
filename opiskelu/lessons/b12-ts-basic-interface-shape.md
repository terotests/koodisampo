# API-vastauksella on kentät `id` ja `title`. Miten kuvailet muodon TS:ssä?

## Tilanne

Frontend hakee artikkelilistauksen REST-API:sta. Vastaus on JSON-objekteja, joissa on vähintään `id` ja `title`:

```typescript
const item = await fetch('/api/articles/1').then(r => r.json());
render(item.title); // mitä jos kenttä puuttuu tai on väärää tyyppiä?
```

Ilman muotokuvausta virheet löytyvät vasta selaimessa tai integraatiotestissä.

## Ratkaisu

**interface User { id: string; title: string }**:

```typescript
interface User {
  id: string;
  title: string;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json() as User; // runtime-validointi erikseen suositeltavaa
}

function render(user: User) {
  document.title = user.title;
}
```

`interface` kuvaa objektin odotetut kentät ja niiden tyypit. Puuttuva tai väärätyyppinen kenttä näkyy heti editorissa ja käännöksessä.

## Käytännössä

Nimeä rajapintatyypit domain-kielen mukaan (`User`, `Order`, `Article`) — nimi kuvaa kontekstia, kentät kuvaavat muodon. Jaa jaetut kentät `BaseEntity`-tyyppiin `extends`-avulla. Tuotannossa yhdistä `interface` runtime-skeemaan (Zod, JSON Schema), jotta API:n muutokset eivät mene läpi pelkällä `as`-castilla.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/objects.html)
