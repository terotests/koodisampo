# function log(x: string | number) — x.toFixed()?

## Tilanne

Lokituskomponentti tulostaa arvon riippuen tyypistä — desimaalit pyöristetään, merkkijonot sellaisenaan:

```typescript
function log(x: string | number) {
  console.log(x.toFixed(2)); // virhe: Property 'toFixed' does not exist on type 'string'
}
```

`toFixed` on vain `number`-prototyypissä. Union-tyypillä TypeScript sallii vain yhteiset jäsenet ennen kaventamista.

## Ratkaisu

**typeof x === 'number' guard ennen toFixed**:

```typescript
function log(x: string | number) {
  if (typeof x === 'number') {
    console.log(x.toFixed(2)); // x on number tässä haarassa
  } else {
    console.log(x.toUpperCase()); // x on string
  }
}
```

`typeof`-tarkistus on type guard: true-haarassa `x` kavenee `number`:ksi, false-haarassa `string`:ksi.

## Käytännössä

`typeof null === 'object'` on JS-historiallinen anomalia — käytä `x !== null && typeof x === 'object'` objekteille. `typeof` toimii primitiiveille; custom-tyypeille käytä `in`-operaattoria, discriminated unionia tai user-defined type guardia. Älä castaa (`as number`) ilman perustetta.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
