# readonly string[] vs string[] — ero?

## Tilanne

Jaettu konfiguraatiotaulukko välitetään usealle moduulille. Yksi moduuli mutatoi listaa vahingossa:

```typescript
const ROLES = ['admin', 'editor', 'viewer'];

function initAuth(roles: string[]) {
  roles.push('superadmin'); // muuttaa alkuperäistä taulukkoa!
}

initAuth(ROLES);
console.log(ROLES.length); // 4 — yllätys muualla koodissa
```

Ilman readonly-merkintää TypeScript ei estä `push`, `pop` tai indeksi-assignointia.

## Ratkaisu

**readonly estää mutoinnin push yms. compile-time**:

```typescript
const ROLES: readonly string[] = ['admin', 'editor', 'viewer'];

function initAuth(roles: readonly string[]) {
  // roles.push('superadmin'); // virhe: Property 'push' does not exist on readonly string[]
  const copy = [...roles]; // ok — uusi taulukko
}

type ReadonlyRoles = readonly string[]; // sama kuin ReadonlyArray<string>
```

`readonly` taulukossa kentät ovat vain luettavissa compile-time. Runtime-taulukko on edelleen tavallinen JS-array — readonly on kehittäjäsopimus, ei immuuttisuutta runtimeen.

## Käytännössä

`Readonly<T>` objekteille, `as const` vakiomuotoisille taulukoille. `ReadonlyArray<T>` vs `readonly T[]` — sama merkitys. Jos tarvitset oikean immuuttisuuden, käytä struktuuridataa (Immer) tai kopioi ennen mutointia. Deep readonly vaatii utility-tyypin tai kirjaston.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
