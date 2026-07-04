# type IsString<T> = T extends string ? true : false — laji?

## Tilanne

Kirjastossa tarvitaan type-level logiikkaa: onko geneerinen parametri merkkijono vai ei, jotta voidaan valita eri palautustyyppi:

```typescript
// Halutaan: jos T on string → palauta T, muuten → never
type OnlyString<T> = ???;
```

Tavallinen union ei riitä — päätös pitää tehdä tyypin perusteella käännösaikana.

## Ratkaisu

**Exhaustiveness check — uusi variantti compile error**:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>;      // false

// Käytännön esimerkki — ehdollinen palautus:
type StringOrNever<T> = T extends string ? T : never;

type Ok = StringOrNever<'x'>;   // 'x'
type Bad = StringOrNever<number>; // never
```

Tämä on conditional type: `T extends string ? true : false` arvioi ehto type-tasolla. Sama mekanismi kuin exhaustive `never`-tarkistuksessa switchissä — jos unioniin tulee uusi jäsen, ehdollinen tyyppi voi tuottaa odottamattoman tuloksen ja paljastaa virheen.

## Käytännössä

Distributed conditional types: `T` union jakautuu (`IsString<string | number>` → `boolean`). Estä jakauma: `[T] extends [string]`. Hyödyllisiä työkaluja: `Exclude`, `Extract`, `NonNullable` — ne perustuvat samaan syntaksiin. Älä ylikäytä — monimutkainen type-level koodi on vaikea debugata.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
