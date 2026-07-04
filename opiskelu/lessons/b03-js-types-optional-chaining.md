# API-vastaus voi olla null — `user.profile.name` kaataa tuotannossa. Moderni suoja?

## Tilanne

Dashboard renderöi käyttäjän nimen heti sivun latauksen jälkeen:

```javascript
function renderHeader(response) {
  const user = response.data; // voi olla null jos sessio vanhentunut
  document.title = user.profile.name;
}
```

Kun sessio on vanhentunut, API palauttaa `{ data: null }`. Tuotannossa Sentry täyttyy `TypeError: Cannot read properties of null (reading 'profile')` -virheistä. Bugi on harvinainen kehityksessä, koska testidata on aina täydellinen.

Vanha suojaus vaati useita tasoja:

```javascript
if (user && user.profile && user.profile.name) { /* ... */ }
```

## Ratkaisu

**Optional chaining: user?.profile?.name estää TypeError null-polulla** — palauttaa `undefined` sen sijaan, että kaatuisi:

```javascript
function renderHeader(response) {
  const user = response.data;
  const name = user?.profile?.name;
  document.title = name ?? 'Kirjaudu sisään';
}
```

Koko ketju on yksi lauseke, joka on helppo lukea ja ylläpitää.

## Käytännössä

Optional chaining ei korvaa virheenkäsittelyä: jos `user` on pakollinen, tarkista se erikseen ja ohjaa kirjautumissivulle. Käytä `?.` kun puuttuva arvo on odotettu ja käsiteltävä gracefully.

Yhdistä `??`-operaattoriin oletusarvoihin. MDN: `?.` lyhentää null-tarkistuksia merkittävästi API-vastauksissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
