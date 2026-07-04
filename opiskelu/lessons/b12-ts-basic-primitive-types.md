# TypeScriptissä haluat merkitä että `age` on kokonaisluku. Tyyppi?

## Tilanne

Rakennat käyttäjäprofiilin lomaketta. JavaScriptissä `age` voi vahingossa olla merkkijono tai `undefined`:

```typescript
let age = "25"; // JSON-lomake palauttaa stringin
const nextYear = age + 1; // "251" — hiljainen bugi
```

TypeScript-projektissa haluat kertoa kääntäjälle ja tiimille, että ikä on aina numero.

## Ratkaisu

**let age: number**:

```typescript
let age: number = 25;

age = 26;        // ok
// age = "25";   // virhe: Type 'string' is not assignable to type 'number'

function yearsUntilRetirement(currentAge: number): number {
  return 65 - currentAge;
}
```

Primitiivityypit `number`, `string` ja `boolean` kuvaavat arvon muotoa. TypeScript tarkistaa assignoinnit ja funktiokutsut käännösaikana.

## Käytännössä

Anna tyyppi muuttujalle kun arvo ei ole heti selvä tai API-sopimus vaatii sen. `let age = 25` riittää usein (type inference), mutta funktioiden parametreissa ja julkisissa rajapinnoissa annotaatio parantaa luettavuutta. Muista: `number` kattaa myös desimaalit — kokonaislukujen rajoittamiseen tarvitaan erillinen validointi tai brändätty tyyppi.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)
