# if ('kind' in obj) — mitä tämä tekee?

## Tilanne

Funktio käsittelee sekä koiria että kissoja saman union-tyypin kautta:

```typescript
type Pet = Dog | Cat;

interface Dog {
  kind: 'dog';
  breed: string;
}

interface Cat {
  kind: 'cat';
  lives: number;
}

function describe(pet: Pet) {
  console.log(pet.lives); // virhe: Property 'lives' does not exist on type 'Dog'
}
```

Kentät eivät ole yhteisiä kaikille union-jäsenille — tarvitaan kaventaminen ennen pääsyä.

## Ratkaisu

**Property narrowing — tarkistaa kentän olemassaolon**:

```typescript
function describe(pet: Pet) {
  if ('lives' in pet) {
    console.log(`Cat with ${pet.lives} lives`); // Cat
  } else {
    console.log(`Dog: ${pet.breed}`); // Dog
  }
}
```

`'kind' in obj` (tai mikä tahansa kenttänimi) tarkistaa, onko property objektissa. TypeScript kavenee tyypin sen perusteella, kun union-jäsenet erottuvat kentillä.

## Käytännössä

`in` toimii parhaiten strukturaalisesti erottuvissa unioneissa. Prototyyppiketjun metodeille `in` ei riitä — käytä `instanceof`. Discriminated union (`kind: 'dog' | 'cat'`) + `switch (pet.kind)` on usein selkeämpi kuin satunnainen kenttänimi. Varmista että kaikki haarat on käsitelty.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
