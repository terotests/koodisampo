# Milloin type alias parempi kuin interface?

## Tilanne

Tiimi määrittelee API-vastauksia ja aputyyppejä. Kaikki merkitään `interface`:llä, myös unionit:

```typescript
interface Id = string | number; // syntaksivirhe — interface ei tue unionia
interface Point = { x: number; y: number } | { r: number; theta: number };
```

Jotkut muodot eivät ole `interface`-syntaksilla ilmaistavissa. Tarvitaan `type`-aliaksia.

## Ratkaisu

**Union/intersection/primitive alias — type sopii**:

```typescript
type Id = string | number;

type Point =
  | { x: number; y: number }
  | { r: number; theta: number };

type NamedUser = User & { displayName: string };

type ReadonlyUser = Readonly<User>;
```

`type` kuvaa minkä tahansa tyypin: unionit, intersectionit, primitiivit, mapped ja conditional types. `interface` sopii objektien muotojen laajennettavaan kuvaukseen.

## Käytännössä

Yleinen linja: objektin kentät ja luokat → `interface` (declaration merging, parempi virheilmoitukset). Unionit, tuplet, utility-yhdistelmät → `type`. ESLint-sääntö `@typescript-eslint/consistent-type-definitions` voi yhtenäistää tiimin valinnan. Älä kiista tyyleistä — tärkeintä on oikea työkalu oikealle muodolle.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
