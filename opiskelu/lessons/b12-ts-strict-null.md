# strictNullChecks päällä — mikä muuttuu?

## Tilanne

Legacy-projekti otetaan käyttöön tiukemmat compiler-asetukset. Aiemmin `null` liukui mihin tahansa:

```typescript
// strictNullChecks: false
function greet(name: string) {
  return `Hello, ${name.toUpperCase()}`;
}

greet(null); // ei virhettä käännöksessä — runtime kaatuu
```

Kehittäjä olettaa että `string` tarkoittaa "ei-null merkkijonoa", mutta vanha TS salli `null` ja `undefined` hiljaa.

## Ratkaisu

**Discriminated union — TS narrowaa kindin perusteella**:

```typescript
// strictNullChecks: true
function greet(name: string | null) {
  if (name === null) return 'Hello, guest';
  return `Hello, ${name.toUpperCase()}`; // name on string
}

type Result =
  | { kind: 'ok'; value: string }
  | { kind: 'error'; message: string };

function handle(r: Result) {
  switch (r.kind) {
    case 'ok':
      return r.value.length; // narrowattu ok-haaraan
    case 'error':
      return r.message;
  }
}
```

`strictNullChecks` erottaa `null` ja `undefined` muista tyypeistä — ne eivät assignoidu automaattisesti `string`:iin. Discriminated union (`kind`-kenttä) yhdistää `switch`:iin: TypeScript kavenee variantin perusteella ja pakottaa käsittelemään kaikki haarat.

## Käytännössä

Ota `strictNullChecks` käyttöön uusissa projekteissa heti. Refaktoroi: lisää `| null` / `| undefined` rehellisesti, korjaa optional chaining (`?.`) ja nullish coalescing (`??`). `!`-non-null assertion on hätäpoika — käytä vain kun olet varma. Discriminated union on suosituin tapa mallintaa "joko onnistui tai epäonnistui".

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
