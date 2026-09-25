# Lomake muuntaa kentän numeroksi, ja `if (!quantity)` hylkää validin arvon 0. Parempi tarkistus puuttuvalle arvolle?

## Tilanne

Tilauslomake muuntaa määräkentän numeroksi ja tarkistaa pakolliset kentät:

```javascript
const quantity = form.quantity === '' ? null : Number(form.quantity);

if (!quantity) {
  return 'Määrä on pakollinen';
}
```

Käyttäjä syöttää tuotemääräksi `0` — validi arvo (esim. tuotteen poisto tilauksesta). Numeroksi muunnettuna `0` on falsy, joten tarkistus hylkää sen virheellisesti "pakollinen"-viestillä.

JavaScriptin falsy-arvot: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Kaikki muu on truthy — mukaan lukien `'0'` merkkijonona. Siksi ongelma syntyy vasta, kun kentän arvo on muunnettu numeroksi.

## Ratkaisu

**quantity == null — hylkää vain null/undefined, ei nollaa:**

```javascript
if (quantity == null) {
  return 'Määrä on pakollinen';
}
if (Number.isNaN(quantity)) {
  return 'Syötä numero';
}
// OK, myös quantity === 0
```

`== null` osuu täsmälleen arvoihin `null` ja `undefined`. Virheellinen syöte (`NaN`) kannattaa tarkistaa erikseen `Number.isNaN`illa.

## Käytännössä

Määrittele jokaiselle kentälle erikseen, mitkä arvot ovat virheellisiä. HTML5 `required`-attribuutti ja lomakekirjastot (Zod, Yup) auttavat, mutta peruslogiikka on sama.

MDN truthy/falsy: `0` on falsy mutta usein validi syöte — älä sekoita "tyhjä" ja "nolla".

[Lue lisää](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
