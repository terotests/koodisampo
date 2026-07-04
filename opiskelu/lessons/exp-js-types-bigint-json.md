# API palauttaa 64-bit ID:n — JSON.parse menettää tarkkuuden. Miten käsittelet?

## Tilanne

Twitter-tyylinen palvelu palauttaa tunnisteita, jotka ylittävät JavaScriptin turvallisen kokonaisluvun rajan:

```javascript
const json = '{"id": 9007199254740993}';
const data = JSON.parse(json);
console.log(data.id);                    // 9007199254740992 — väärä ID!
console.log(data.id === 9007199254740993); // false
```

`Number.MAX_SAFE_INTEGER` on `9007199254740991` (2⁵³ − 1). JSON.parse muuntaa numerot automaattisesti IEEE 754 -doubleiksi, ja suuret kokonaisluvut pyöristyvät. Seuraava API-kutsu väärällä ID:llä voi palauttaa 404:n tai vielä pahempaa — toisen käyttäjän datan.

## Ratkaisu

**BigInt tai merkkijono ID:nä ennen Number-muunnosta JSON-datassa** — pidä tunniste merkkijonona tai BigIntinä koko putkessa:

```javascript
// Vaihtoehto 1: API palauttaa ID:n merkkijonona (suositus)
const json = '{"id": "9007199254740993"}';
const { id } = JSON.parse(json);
console.log(id); // "9007199254740993" — tarkka

// Vaihtoehto 2: muunna BigIntiksi heti parsinnan jälkeen
const id = BigInt(data.idString);

// Vaihtoehto 3: custom reviver (varovasti)
const data = JSON.parse(json, (key, value) => {
  if (key === 'id' && typeof value === 'number') {
    return BigInt(value); // huom: numero on jo voinut pyöristyä!
  }
  return value;
});
```

Paras ratkaisu on neuvotella backendin kanssa: 64-bit ID:t JSONissa merkkijonoina.

## Käytännössä

Älä vertaa suuria ID:itä `Number()`-muunnoksella. Käytä merkkijonovertailua tai `BigInt`-arithmetiikkaa. Muista, että `JSON.stringify` ei tue BigInt:iä natiivisti — tarvitset custom replacerin tai serialisoit stringiksi.

MDN dokumentoi BigIntin ja JSON-rajoitukset erikseen. Snowflake-ID:t, Discord-ID:t ja monet tietokanta-ID:t vaativat tämän huomion.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
