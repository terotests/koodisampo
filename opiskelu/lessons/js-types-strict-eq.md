# Miksi `===` on turvallisempi kuin `==` vertailussa?

## Tilanne

Koodikatselmuksessa kollega ehdottaa, että `status == 200` on riittävä HTTP-vastauksen tarkistukseen. Paikallisesti testit menevät läpi, koska API palauttaa numeron. Tuotannossa jokin välipalvelu muuttaa vastauksen merkkijonoksi `'200'`, ja virheelliset vastaukset alkavat lipua läpi.

JavaScriptin löysä vertailu `==` tekee implisiittistä tyyppimuunnosta ennen vertailua. Se on historiallinen kompromissi, joka tekee koodista vaikeasti ennustettavaa:

```javascript
0 == false        // true
'' == false       // true
null == undefined // true
200 == '200'      // true
```

Tiukka vertailu `===` vertaa sekä arvoa että tyyppiä ilman muunnosta. Kun logiikka perustuu tarkkoihin tyyppeihin — numerot, merkkijonot, booleanit — löysä vertailu on yleensä vahinko odottamassa.

## Ratkaisu

**Tiukka vertailu ilman implisiittistä tyyppimuunnosta** tarkoittaa `===`- ja `!==`-operaattoreiden käyttöä oletuksena:

```javascript
function isOk(response) {
  return response.status === 200;
}

// Eksplisiittinen, jos haluat sallia sekä numeron että merkkijonon:
function isOkLoose(response) {
  return Number(response.status) === 200;
}
```

`===` ei yritä muuntaa `'200'` numeroksi 200:ksi — vertailu on `false`, ja bugi paljastuu heti kehitysvaiheessa eikä vasta tuotannossa.

## Käytännössä

ESLint-sääntö `eqeqeq` pakottaa tiukan vertailun useissa projekteissa. Poikkeus on harvinainen tapaus, jossa haluat tarkoituksella käsitellä `null` ja `undefined` yhdessä: `value == null` on tiukempaa kuin `!value`, koska se ei sekoita nollaa tai tyhjää merkkijonoa puuttuvaan arvoon.

MDN suosittelee oletuksena `===`-vertailua. Käytä `==` vain, jos tiedät tarkalleen mitä tyyppimuunnos tekee ja kommentoit sen syyn.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
