# API palauttaa `{ name?: string }` — miten luet turvallisesti ilman undefined crash?

## Tilanne

Frontend hakee käyttäjäprofiilin ja renderöi tervehdyksen:

```javascript
async function greet(userId) {
  const user = await fetchUser(userId); // { profile?: { name?: string } }
  return `Hei, ${user.profile.name}!`;
}
```

Jos `profile` puuttuu — esimerkiksi uusi käyttäjä ei ole täyttänyt profiilia — koodi kaatuu: `Cannot read properties of undefined (reading 'name')`. TypeScript varoittaa tästä, mutta runtime-koodissa optional propertyt ovat edelleen yleinen tuotantobugi.

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
