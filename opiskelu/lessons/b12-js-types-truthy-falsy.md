# Lomakevalidointi: `if (!value)` hylkää syötteen '0'. Parempi tarkistus tyhjälle kentälle?

## Tilanne

Rekisteröintilomake tarkistaa pakolliset kentät:

```javascript
function validateField(value, label) {
  if (!value) {
    return `${label} on pakollinen`;
  }
}
```

Käyttäjä syöttää `0` ikäkenttään tai `0` tuotemääräksi — molemmat ovat validi arvo. Falsy-tarkistus hylkää ne virheellisesti "pakollinen"-viestillä.

JavaScriptin falsy-arvot: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Kaikki muu on truthy — mukaan lukien `'0'` merkkijonona.

## Ratkaisu

**value === '' || value == null — älä käytä pelkkää falsy** erottaa tyhjän kentän nollasta:

```javascript
function validateRequired(value, label) {
  if (value == null || value === '') {
    return `${label} on pakollinen`;
  }
}

// Numeeriselle kentälle erikseen:
function validateAge(value) {
  if (value === '' || value == null) return 'Ikä on pakollinen';
  const age = Number(value);
  if (Number.isNaN(age)) return 'Syötä numero';
  return null; // OK, myös age === 0
}
```

## Käytännössä

Määrittele jokaiselle kentälle erikseen, mitkä arvot ovat virheellisiä. HTML5 `required`-attribuutti ja lomakekirjastot (Zod, Yup) auttavat, mutta peruslogiikka on sama.

MDN truthy/falsy: `0` on falsy mutta usein validi syöte — älä sekoita "tyhjä" ja "nolla".

[Lue lisää](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
