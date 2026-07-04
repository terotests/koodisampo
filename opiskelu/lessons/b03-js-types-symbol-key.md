# Kirjasto haluaa piilottaa metadatan objektista ilman name collision -riskiä. Tyyppi?

## Tilanne

Rakennat plugin-järjestelmää, jossa kolmannen osapuolen koodi saa käsitellä käyttäjäobjekteja. Kirjasto haluaa liittää sisäistä metadataa — versio, cache-avain, validointitila — ilman että se törmää käyttäjän omiin kenttiin:

```javascript
const user = { name: 'Maija', id: 1 };
user._meta = { version: 2 }; // vaarallinen: _meta voi olla jo käytössä
user.__internal = { ... };    // sama ongelma
```

Merkkijonoavaimet näkyvät `Object.keys()`-listauksissa, serialisoituvat JSONiin ja voivat törmätä tulevaisuudessa. Tarvitaan avain, joka on *varmasti* uniikki eikä vahingossa enumerable.

## Ratkaisu

**Symbol('meta') avaimena — ei näy Object.keys():ssa** luo globaalisti uniikin tunnisteen:

```javascript
const META = Symbol('meta');

function attachMeta(obj, data) {
  obj[META] = data;
}

function getMeta(obj) {
  return obj[META];
}

const user = { name: 'Maija' };
attachMeta(user, { version: 2, cached: true });

Object.keys(user);     // ['name'] — META piilossa
JSON.stringify(user);  // '{"name":"Maija"}' — META ei mukana
```

Jokainen `Symbol('meta')`-kutsu luo eri symbolin, ellei käytä `Symbol.for()` globaalia rekisteriä.

## Käytännössä

Symbol sopii kirjastojen sisäiseen metadataan, iterointiprotokollille (`Symbol.iterator`) ja hyvin harvoin tarvittaviin "piilo"-avainiin. Muista, että Symbol-avaimet eivät ole salattuja — ne ovat piilossa vain tavallisilta iteroinneilta.

MDN: `Object.getOwnPropertySymbols()` paljastaa ne, jos tarvitset. Tuotantokoodissa WeakMap on usein parempi valinta objektikohtaiseen metadataan ilman muokkausta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
