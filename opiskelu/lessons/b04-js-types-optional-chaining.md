# API palauttaa käyttäjäobjektin, jossa profile voi puuttua kokonaan. Haluat lukea displayName-nimen ilman TypeErroria, mutta ilman viiden rivin if-ketjua. Mikä ES2020-operaattori auttaa?

## Tilanne

React-komponentti renderöi profiilin heti mountissa:

```javascript
function Profile({ user }) {
  return <h1>{user.profile.name}</h1>;
}
```

Kun `user` ladataan asynkronisesti, ensimmäisellä renderillä `user` on `null`. Tuotannossa error boundary sieppaa virheen, mutta käyttäjä näkee tyhjän sivun. Ilman optional chainingia tarvitaan guard clause tai ehdollinen renderöinti joka paikassa.

## Ratkaisu

**user?.profile?.name** — optional chaining palauttaa `undefined` null-polulla:

```javascript
function Profile({ user }) {
  return <h1>{user?.profile?.name ?? 'Ladataan...'}</h1>;
}
```

Tai guard clause selkeämpään virheenkäsittelyyn:

```javascript
function Profile({ user }) {
  if (!user?.profile) return <Skeleton />;
  return <h1>{user.profile.name}</h1>;
}
```

## Käytännössä

Optional chaining on ES2020-standardi ja toimii TypeScriptissä natiivisti. Se lyhentää koodia merkittävästi syvissä API-rakenteissa kuten `order?.items?.[0]?.product?.name`.

MDN: `?.` ei heitä virhettä — se palauttaa `undefined`. Muista erottaa "puuttuva arvo" ja "tyhjä merkkijono" tarvittaessa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
