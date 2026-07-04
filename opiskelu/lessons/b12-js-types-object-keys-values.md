# Haluat iteroida objektin arvot ilman for...in prototyypin perintää. Metodi?

## Tilanne

Konfiguraatio-objekti perii oletukset:

```javascript
const defaults = { theme: 'light', lang: 'fi' };
const config = Object.create(defaults);
config.fontSize = 16;

for (const key in config) {
  console.log(key, config[key]);
}
// Tulostaa myös 'theme' ja 'lang' — peritty prototyypistä
```

`for...in` iterates koko prototype-ketjun. Serialisointiin, validointiin ja UI-renderöintiin tarvitaan usein vain *omat* kentät — tai suoraan arvot ilman avain-arvo -parien purkamista.

## Ratkaisu

**Object.values(obj) tai Object.entries(obj)** iterovat vain oman objektin kentät:

```javascript
Object.keys(config);     // ['fontSize']
Object.values(config);   // [16]
Object.entries(config);  // [['fontSize', 16]]

// Iterointi arvoilla
for (const value of Object.values(config)) {
  console.log(value);
}

// Avain + arvo
for (const [key, value] of Object.entries(config)) {
  console.log(`${key}: ${value}`);
}
```

## Käytännössä

`Object.entries` on kätevä Map-muunnokseen: `new Map(Object.entries(obj))`. `Object.fromEntries` tekee käänteisen.

MDN: nämä metodit eivät iterioi Symbol-avaimia — niihin `Object.getOwnPropertySymbols()`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
