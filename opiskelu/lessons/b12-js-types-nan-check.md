# Laskenta palauttaa NaN — `value === NaN` on aina false. Miten tarkistat?

## Tilanne

Hintalaskuri laskee alennuksen:

```javascript
const discount = (price - coupon) / items;
// items === 0 → discount on NaN

if (discount === NaN) {
  showError('Virheellinen laskenta');
}
// Virheilmoitusta ei koskaan näytetä
```

NaN on "Not a Number" — erityinen IEEE 754 -arvo. Se ei ole yhtä kuin mikään muu arvo, **myös ei itsensä kanssa**. Siksi suora vertailu `=== NaN` on aina `false`.

## Ratkaisu

**Number.isNaN(value) tai Object.is(value, NaN)** tunnistaa NaN:n luotettavasti:

```javascript
if (Number.isNaN(discount)) {
  showError('Virheellinen laskenta');
}

// Object.is toimii myös:
Object.is(discount, NaN); // true
```

Vältä globaalia `isNaN(value)` — se muuntaa arvon ensin numeroksi:

```javascript
isNaN('hello');        // true — yllättävä
Number.isNaN('hello'); // false — oikea
```

## Käytännössä

Parempi ennaltaehkäisy: `if (!Number.isFinite(result))` kattaa NaN:n ja Infinityn. Validoi jakaja ennen jakolaskua: `if (items === 0)`.

MDN: `Number.isNaN` on ES6-ominaisuus ja tarkempi kuin legacy `isNaN`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
