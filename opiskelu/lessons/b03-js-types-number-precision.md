# Laskin näyttää 0.1 + 0.2 === 0.3 false — laskutuskoodi valittaa senteistä. Ratkaisu?

## Tilanne

Verkkokaupan kassalogiikka laskee tilauksen summan:

```javascript
const subtotal = 0.1 + 0.2;
if (subtotal === 0.3) {
  chargeCustomer(subtotal);
} else {
  throw new Error(`Summa ei täsmää: ${subtotal}`);
}
// Error: Summa ei täsmää: 0.30000000000000004
```

JavaScriptin `Number` on IEEE 754 -double, joka ei esitä kaikkia desimaalilukuja tarkasti. Rahoituslaskennassa senttien vertailu suoraan float-arvoilla johtaa satunnaisiin hylkäyksiin ja sentin tason pyöristysvirheisiin.

## Ratkaisu

**Integer-sentit tai desimaalikirjasto — älä vertaa float-arvoja suoraan:**

```javascript
// Vaihtoehto 1: laske sentteinä (suositus yksinkertaisissa tapauksissa)
function toCents(euros) {
  return Math.round(euros * 100);
}

const subtotalCents = toCents(0.1) + toCents(0.2);
if (subtotalCents === toCents(0.3)) {
  chargeCustomer(subtotalCents / 100);
}

// Vaihtoehto 2: vertaa epsilon-toleranssilla (vain näyttöön, ei rahoitukseen)
Math.abs(a - b) < Number.EPSILON;
```

Tuotantorahoituksessa käytä `decimal.js`, `big.js` tai backendin `DECIMAL`-tyyppiä.

## Käytännössä

Säilytä rahasummat kokonaislukuina (sentit, centit) tai merkkijonoina, kunnes näytät ne käyttäjälle. `Intl.NumberFormat` hoitaa lokalisoidun muotoilun.

MDN varoittaa Number-tyypin rajoituksista. Älä koskaan vertaa `===`-operaattorilla kahta laskettua desimaalia ilman pyöristystä tai integer-muunnosta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
