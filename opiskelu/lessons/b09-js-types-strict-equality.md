# Code review: `if (userId == 0)` hyväksyy myös tyhjän stringin. Korjaus?

## Tilanne

Käyttäjän poistologiikka tarkistaa admin-ID:n:

```javascript
if (userId == 0) {
  throw new Error('Et voi poistaa järjestelmäkäyttäjää');
}
```

Code review huomauttaa: `'' == 0` on `true` JavaScriptissä, koska tyhjä merkkijono muunnetaan numeroksi 0 ennen vertailua. Jos `userId` tulee lomakkeesta merkkijonona, tyhjä syöte laukaisee suojauksen vahingossa — tai päinvastoin, riippuen logiikasta.

Löysä vertailu tekee koodista vaikeasti ennustettavaa eri syöttötyypeillä.

## Ratkaisu

**Käytä === strict equality — ei type coercion tyhjän stringin kanssa:**

```javascript
if (userId === 0) {
  throw new Error('Et voi poistaa järjestelmäkäyttäjää');
}

// Normalisoi ensin, jos syöte voi olla merkkijono:
const id = Number(userId);
if (id === 0) {
  throw new Error('Et voi poistaa järjestelmäkäyttäjää');
}
```

`'' === 0` on `false` — tiukka vertailu ei sekoita tyhjää merkkijonoa nollaan.

## Käytännössä

Validoi ja normalisoi syöte heti rajapinnassa (URL-param, lomake, API). Käytä `===` kaikkialla, paitsi tarkoituksellisessa `value == null` -tarkistuksessa.

MDN equality comparisons listaa kaikki `==`-vertailun yllätykset — hyvä syy välttää niitä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
