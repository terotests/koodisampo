# Bugi: `if (count == '0')` menee läpi kun count on 0. Fix?

## Tilanne

Ostoskorin badge piilotetaan, kun tuotteita ei ole:

```javascript
let count = 0; // numero localStoragesta

if (count == '0') {
  hideBadge();
} else {
  showBadge(count);
}
```

Kun `count` on numero `0`, vertailu `0 == '0'` on `true` JavaScriptin tyyppimuunnoksen takia. Badge piilotetaan — sattumalta oikein. Mutta kun `count` on merkkijono `'0'` API:sta ja logiikka odottaa numeroa, sama vertailu piilottaa badge:n myös silloin, kun tuotteita on 0 kpl — tai sekoittaa `'0'` ja `0` muissa haaroissa.

Ongelma ei ole tässä tapauksessa sattuma vaan epäluotettava vertailu, joka toimii eri tavoin eri syötteillä.

## Ratkaisu

**Käytä === tiukkaan vertailuun ilman tyyppimuunnosta:**

```javascript
if (count === 0) {
  hideBadge();
} else {
  showBadge(count);
}
```

Normalisoi syöte heti, jos se voi tulla sekä merkkijonona että numerona:

```javascript
const count = Number(rawCount);
if (Number.isNaN(count)) {
  // käsittele virheellinen syöte
}
if (count === 0) {
  hideBadge();
}
```

## Käytännössä

Aseta tiukka vertailu oletukseksi koko projektissa. ESLint-sääntö `eqeqeq` estää `==`-käytön. Poikkeus: `value == null` tarkistaa sekä `null` että `undefined` ilman falsy-sekoilua.

MDN: `===` vertaa tyyppiä ja arvoa — `'0' === 0` on aina `false`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
