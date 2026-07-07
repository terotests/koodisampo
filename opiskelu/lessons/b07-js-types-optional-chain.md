# Konsolissa: `TypeError: Cannot read properties of undefined (reading 'name')` rivillä `response.data.user.profile.name`. API palauttaa joskus `{ user: null }`. Mikä ES2020-operaattori lyhentää null check -ketjua?

## Tilanne

Graafinen virheilmoitus konsolissa:

```
TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (app.js:42)
```

Rivi 42 on `response.data.user.profile.name`. API palauttaa joskus `{ data: { user: null } }` poistetun käyttäjän tapauksessa. Jokainen taso tarvitsee null-tarkistuksen, ja koodi paisuu:

```javascript
const name = response &&
  response.data &&
  response.data.user &&
  response.data.user.profile &&
  response.data.user.profile.name;
```

## Ratkaisu

**Optional chaining — user?.profile?.name katkaisee polun undefined-kohdassa:**

```javascript
const name = response?.data?.user?.profile?.name;

if (name == null) {
  showPlaceholder('Käyttäjä ei saatavilla');
} else {
  renderName(name);
}
```

Koko syvä polku on yksi lauseke — luettava ja turvallinen.

## Käytännössä

Optional chaining on ES2020-ominaisuus. Se toimii metodeissa (`obj?.method?.()`) ja taulukoissa (`arr?.[0]?.id`). Yhdistä `??`-operaattoriin oletusarvoihin.

MDN: lyhyt polku palauttaa `undefined` — se ei heitä TypeErroria. Tämä on moderni korvike "Cannot read property" -virheille.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
