# Laskin: 0.1 + 0.2 === 0.3 palauttaa false tuotannossa. Miksi?

## Tilanne

QA-raportti kertoo, että verkkokaupan "Ilmainen toimitus yli 0,30 €" -banneri ei näy, vaikka ostoskorin summa näyttää 0,30 €. Kehittäjä debuggaa:

```javascript
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

Ongelma ei ole logiikkavirhe vaan JavaScriptin lukuaritmetiikan luonne. `Number` on 64-bit IEEE 754 -liukuluku, joka esittää desimaalit binäärimuodossa — ja esimerkiksi 0.1 ei ole tarkasti esitettävissä.

## Ratkaisu

**IEEE 754 double — desimaalit eivät aina tarkkoja; käytä integer senttejä tai decimal-kirjastoa:**

```javascript
// Miksi näin käy
console.log((0.1).toString(2)); // pitkä binääridesimaali...

// Oikea tapa rahalle
const price1 = 10; // 0.10 € sentteinä
const price2 = 20; // 0.20 € sentteinä
const total = price1 + price2; // 30 senttiä = 0.30 €

if (total >= 30) {
  showFreeShippingBanner();
}
```

Jos tarvitset desimaaleja, käytä erikoistunutta kirjastoa — älä luota natiiviin `Number`-tyyppiin rahoituksessa.

## Käytännössä

`Number.EPSILON` auttaa vertailussa, mutta se on liian pieni rahoituslaskentaan. Pyöristä näyttöön `toFixed(2)` tai `Intl.NumberFormat`, mutta laske taustalla sentteinä.

MDN selittää Number-tyypin rajoitukset. Tämä on yksi JavaScriptin tunnetuimmista "gotcha"-tapauksista — opeta se koko tiimille kerran.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
