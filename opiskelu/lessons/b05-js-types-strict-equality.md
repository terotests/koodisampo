# Code review: `if (status == '200')` — miksi pyydetään muutosta?

## Tilanne

Pull requestissa HTTP-client palauttaa statuksen numerona, mutta tarkistus vertaa merkkijonoon:

```javascript
const response = await fetch(url);
if (response.status == '200') {
  return response.json();
}
```

Paikallisesti tämä toimii — `200 == '200'` on `true` tyyppimuunnoksen ansiosta. Code review -kommentti pyytää muutosta `===`-vertailuun. Miksi?

Koska `==` piilottaa tyyppivirheet. Jos jokin refaktorointi muuttaa statuksen merkkijonoksi `'200 OK'` tai `'201'`, löysä vertailu antaa yllättäviä tuloksia. Tiukka vertailu pakottaa käsittelemään tyypit tietoisesti.

## Ratkaisu

**=== välttää implisiittisen tyyppimuunnoksen (esim. 200 == '200')** — vertaa arvoa ja tyyppiä:

```javascript
if (response.status === 200) {
  return response.json();
}

// Tai eksplisiittinen normalisointi, jos status voi olla merkkijono:
if (Number(response.status) === 200) {
  return response.json();
}
```

## Käytännössä

Projektin lint-säännöt (`eqeqeq: "always"`) estävät tämän luokan bugit automaattisesti. `fetch().status` on aina numero — vertaa suoraan `=== 200`.

MDN equality comparisons -opas listaa kaikki `==`-vertailun tyyppimuunnos-säännöt — hyvä lukemista kerran, mutta älä luota niihin tuotannossa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
