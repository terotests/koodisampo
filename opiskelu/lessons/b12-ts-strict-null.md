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

**null ja undefined ovat omia tyyppejään — ne pitää käsitellä ennen käyttöä:**

```typescript
// strictNullChecks: true
function greet(name: string | null) {
  if (name === null) return 'Hello, guest';
  return `Hello, ${name.toUpperCase()}`; // name on string
}
```

`strictNullChecks` erottaa `null` ja `undefined` muista tyypeistä — ne eivät assignoidu automaattisesti `string`:iin. `greet(null)` antaa nyt käännösvirheen, ja `string | null` -tyyppi pitää kaventaa (esim. `=== null`-tarkistuksella) ennen merkkijonometodien käyttöä.

## Käytännössä

Ota `strictNullChecks` käyttöön uusissa projekteissa heti. Refaktoroi: lisää `| null` / `| undefined` rehellisesti, korjaa optional chaining (`?.`) ja nullish coalescing (`??`). `!`-non-null assertion on hätäpoika — käytä vain kun olet varma.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
