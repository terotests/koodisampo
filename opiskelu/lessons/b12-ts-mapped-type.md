# type ReadonlyFields<T> = { readonly [K in keyof T]: T[K] } — mikä tyyppirakenne?

## Tilanne

API-vastauksen DTO halutaan immuutiksi compile-time — kukaan moduuli ei saa muokata kenttiä suoraan:

```typescript
interface User {
  id: string;
  name: string;
}

function render(user: User) {
  user.name = 'Hacked'; // sallittu ilman readonly-mapped-tyyppiä
}
```

Käsin kopioit `readonly`-modifier jokaiselle kentälle — toistoa ja ylläpitokuormaa.

## Ratkaisu

**Mapped type — käy läpi T:n avaimet ja muuntaa ne:**

```typescript
type ReadonlyFields<T> = {
  readonly [K in keyof T]: T[K];
};

type ImmutableUser = ReadonlyFields<User>;
// { readonly id: string; readonly name: string; }

function render(user: ImmutableUser) {
  // user.name = 'x'; // virhe: Cannot assign to 'name' because it is a read-only property
}
```

Tämä on mapped type: `[K in keyof T]` käy läpi jokaisen avaimen ja luo uuden tyypin. TypeScriptin sisäänrakennettu `Readonly<T>` tekee saman. Myös `Partial` ja `Pick` ovat mapped typejä. Conditional type (`T extends U ? X : Y`) on eri rakenne: se valitsee tyypin ehdon perusteella.

## Käytännössä

Modifierit mapped typeissa: `readonly`, optional `?`, `-readonly` poistaa. `Record<Keys, Type>` on mapped type erikoistapauksessa. Yhdistä: `{ readonly [K in keyof T as Capitalize<K>]: T[K] }` (key remapping TS 4.1+). Muista: shallow readonly — sisäkkäiset objektit vaativat rekursiivisen utilityn.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
