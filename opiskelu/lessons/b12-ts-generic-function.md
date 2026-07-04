# identity<T>(arg: T): T — miksi generic?

## Tilanne

Apukirjastossa on identiteettifunktio, jota käytetään eri tyypeille:

```typescript
function identity(arg: any): any {
  return arg;
}

const n = identity(42);       // any — tyyppitieto katoaa
const s = identity('hello');  // any
```

Ilman genericiä joudut valitsemaan `any`:n (turvaton) tai ylikuormittamaan jokaiselle tyypille erikseen (toistoa).

## Ratkaisu

**Säilyttää tyypin parametrista paluuarvoon**:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const n = identity(42);        // number
const s = identity('hello');   // string
const u = identity({ id: 1 }); // { id: number }
```

Generic `<T>` sitoo syötetyypin ja paluutyypin: kutsukohtainen tyyppi päätellään argumentista tai annetaan eksplisiittisesti `identity<number>(42)`.

## Käytännössä

Generics ovat parametreja tyypille, ei arvolle. Käytä kun logiikka on sama mutta tyyppi vaihtelee (`Array<T>`, `Promise<T>`, `Map<K, V>`). Liian monimutkainen generic-signatuuri heikentää luettavuutta — joskus overload tai erilliset funktiot ovat selkeämpiä.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
