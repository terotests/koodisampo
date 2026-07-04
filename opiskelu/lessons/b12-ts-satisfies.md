# const palette = { red: '#f00' } satisfies Record<string, string> — hyöty?

## Tilanne

Teemavärit määritellään objektina. Kehittäjä haluaa varmistaa, että kaikki arvot ovat merkkijonoja, mutta säilyttää tarkat avainten nimet tyypityksessä:

```typescript
const palette: Record<string, string> = { red: '#f00', bleu: '#00f' };
// palette.red on string — extra key 'bleu' ei näy typo-virheenä vs suunnitelma
```

Pelkkä annotaatio `Record<string, string>` leventää avaimet ja arvot liikaa.

## Ratkaisu

**Tarkistaa muodon säilyttäen tarkat literal-tyypit**:

```typescript
const palette = {
  red: '#f00',
  green: '#0f0',
} satisfies Record<string, string>;

type PaletteKey = keyof typeof palette; // 'red' | 'green'
const hex: string = palette.red;        // ok, arvo on string
// palette.red = 123;                   // virhe: number ei ole string
```

`satisfies` validoi että lauseke täyttää annetun tyypin, mutta päätelty tyyppi pysyy tarkkana (literal avaimet, ei pelkkä `Record`).

## Käytännössä

Vertaa `as Record<string, string>` (leventää) ja `: Record<string, string>` (leventää muuttujan tyypin). `satisfies` on TS 4.9+ — ihanteellinen config-objekteille, reititysmapeille ja API-sopimusten tarkistukseen. Yhdistä `as const satisfies ...` kun tarvitset readonly literalit.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
