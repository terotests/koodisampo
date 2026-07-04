# Funktio `add(a, b)` palauttaa summan. Parametrien ja paluuarvon tyypitys?

## Tilanne

Apumoduuliin lisätään yksinkertainen laskuri, jota kutsutaan monesta paikasta:

```typescript
function add(a, b) {
  return a + b;
}

add(2, 3);      // 5
add('2', '3');  // "23" — JS yhdistää merkkijonot
```

Ilman tyypitystä TypeScript päättelee liian laajan tyypin (`any` parametreille implicit any -tilassa) tai sallii virheelliset kutsut.

## Ratkaisu

**function add(a: number, b: number): number**:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);        // ok, palauttaa 5
// add('2', 3);   // virhe: Argument of type 'string' is not assignable
// add(2);        // virhe: Expected 2 arguments, but got 1
```

Parametrit annotoidaan `: number` ja paluuarvo `: number` funktion allekirjoituksessa. Kääntäjä varmistaa kutsut ja return-lausekkeen yhteensopivuuden.

## Käytännössä

Arrow-funktioille sama malli: `const add = (a: number, b: number): number => a + b`. Jos paluutyyppi on ilmeinen, `: number` voidaan jättää pois (inference), mutta julkisissa API-funktioissa paluutyyppi dokumentoi sopimuksen. Optional parametrit: `b?: number` tai oletusarvo `b = 0`.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions)
