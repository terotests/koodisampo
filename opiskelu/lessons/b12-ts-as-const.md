# const config = { mode: 'dev' } as const — hyöty?

## Tilanne

Sovelluksen ympäristöasetukset määritellään objektina:

```typescript
const config = { mode: 'dev' };
// config.mode on tyyppiä string — liian leveä

type Mode = typeof config.mode; // string, ei 'dev'
```

Union-tyypit ja switch eivät hyödy, jos `mode` on geneerinen `string`.

## Ratkaisu

**Literal types + readonly deep**:

```typescript
const config = { mode: 'dev' } as const;
// { readonly mode: 'dev' }

type Mode = typeof config.mode; // 'dev'

function setMode(m: Mode) { /* ... */ }
// setMode('prod'); // virhe jos 'prod' ei ole sallittu arvo
```

`as const` assertion tekee objektista deeply readonly ja kaventaa arvot literal-tyypeiksi (`'dev'` eikä `string`). Taulukot muuttuvat readonly tupleiksi.

## Käytännössä

Yhdistä `as const`-objekti ja union: `type Mode = typeof config.mode` tai `keyof typeof config`. `[ 'a', 'b' ] as const` → tuple `readonly ['a', 'b']`. Erottele muuttuva runtime-config (interface) ja vakio-lookup (`as const`). `satisfies` tarkistaa muodon säilyttäen literalit — harkitse sitä kun tarvitset sekä validointia että tarkat tyypit.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
