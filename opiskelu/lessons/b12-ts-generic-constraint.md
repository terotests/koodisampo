# T extends { id: string } — tarkoitus?

## Tilanne

Geneerinen repository-funktio tallentaa entiteettejä, mutta kaikilla täytyy olla `id` avainta varten:

```typescript
function save<T>(entity: T): void {
  db.put(entity.id, entity); // virhe: Property 'id' does not exist on type 'T'
}
```

Ilman rajoitetta TypeScript ei tiedä, että `T`:llä on `id`-kenttä.

## Ratkaisu

**Rajoittaa genericin minimimuotoon**:

```typescript
function save<T extends { id: string }>(entity: T): void {
  db.put(entity.id, entity);
}

interface User {
  id: string;
  name: string;
}

save({ id: 'u1', name: 'Ada' }); // ok
// save({ name: 'Bob' });        // virhe: Property 'id' is missing
```

`extends { id: string }` on generic constraint: `T` voi olla laajempi tyyppi, mutta sen täytyy sisältää vähintään tuo muoto. Funktion sisällä `entity.id` on turvallista.

## Käytännössä

Yleisiä rajoituksia: `T extends keyof SomeType`, `T extends string`, `T extends unknown[]`. Useita rajoituksia: `T extends A & B`. `keyof`-constraintit auttavat type-safe property accessissa. Liian löysä `extends object` ei anna kenttiä — määrittele minimi mitä logiikka tarvitsee.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
