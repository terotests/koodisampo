# Näytät hinnan suomalaiselle käyttäjälle: 1234.5 → '1 234,50 €'. API?

## Tilanne

Verkkokauppa näyttää hinnan suoraan numerona:

```javascript
const price = 1234.5;
element.textContent = price + ' €';
// "1234.5 €" — väärä muoto suomalaiselle käyttäjälle
```

Suomessa tuhaterotin on välilyönti, desimaalierotin pilkku ja euro-merkki hinnan perässä: `1 234,50 €`. Käsin kirjoitettu muotoilu rikkoutuu eri localeissa ja valuutoissa.

## Ratkaisu

**new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' })** lokalisoi automaattisesti:

```javascript
const formatter = new Intl.NumberFormat('fi-FI', {
  style: 'currency',
  currency: 'EUR',
});

formatter.format(1234.5);  // '1 234,50 €'
formatter.format(0);       // '0,00 €'
formatter.format(1234567); // '1 234 567,00 €'
```

Uudelleenkäytettävä funktio:

```javascript
function formatEur(amount) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
```

## Käytännössä

`Intl.NumberFormat` tukee desimaalien määrää: `{ minimumFractionDigits: 2 }`. Luo formatter kerran — älä joka renderillä uudelleen.

MDN: `Intl` API hoitaa myös prosentit (`style: 'percent'`) ja desimaalit ilman valuuttaa. Selaimet tukevat `navigator.language` dynaamiseen localeen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
