# API palauttaa joskus `user: null`, jolloin `user.profile.name` kaatuu TypeErroriin. Miten luet kentän turvallisesti?

## Tilanne

Frontend hakee käyttäjäprofiilin ja renderöi tervehdyksen:

```javascript
async function greet(userId) {
  const user = await fetchUser(userId); // null | { profile?: { name?: string } }
  return `Hei, ${user.profile.name}!`;
}
```

Jos API palauttaa `null` — esimerkiksi käyttäjä on poistettu — koodi kaatuu: `Cannot read properties of null (reading 'profile')`. Sama käy, jos `profile` puuttuu: `Cannot read properties of undefined (reading 'name')`. TypeScript varoittaa tästä, mutta runtime-koodissa puuttuvat välitasot ovat edelleen yleinen tuotantobugi.

Vanha tapa oli pitkä ketju if-lauseita tai `&&`-short-circuitia, joka on vaikealukuista syvissä poluissa.

## Ratkaisu

**Optional chaining: user?.profile?.name turvalliseen syvään lukemiseen** katkaisee ketjun heti, kun välissä on `null` tai `undefined`:

```javascript
async function greet(userId) {
  const user = await fetchUser(userId);
  const name = user?.profile?.name;
  return name ? `Hei, ${name}!` : 'Hei, vieras!';
}
```

Yhdistä nullish coalescingiin oletusarvoa varten:

```javascript
const displayName = user?.profile?.name ?? 'Anonyymi';
```

## Käytännössä

Optional chaining (`?.`) toimii myös metodikutsuissa (`obj?.method?.()`) ja taulukonindekseissä (`arr?.[0]`). Se ei korvaa validointia: jos `name` on pakollinen liiketoimintalogiikassa, tarkista se erikseen ennen jatkamista.

MDN suosittelee optional chainingia null-turvalliseen property-pääsyyn. Se on ES2020-ominaisuus ja tuettu kaikissa moderneissa selaimissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
