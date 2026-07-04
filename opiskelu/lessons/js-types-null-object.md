# Miksi `typeof null === 'object'` on historiallinen ansa?

## Tilanne

Validointifunktio tarkistaa, onko arvo objekti ennen kuin lukee sen kenttiä:

```javascript
function process(value) {
  if (typeof value === 'object') {
    return value.name.toUpperCase();
  }
}
```

Kun API palauttaa `null` — esimerkiksi poistettu käyttäjä — `typeof null` on `'object'`. Funktio yrittää lukea `null.name` ja kaataa tuotannon `TypeError`-virheellä.

Tämä ei ole moderni bugi vaan ES1-aikainen virhe: `null` oli tallennettu tyypin tunnisteella, joka vastasi objektia. Virhe on säilynyt yhteensopivuuden vuoksi, vaikka kehittäjät ovat valittaneet siitä vuosikymmeniä.

## Ratkaisu

**ES-historiallinen vika — käytä eksplisiittistä === null -tarkistusta** ennen kuin luotat `typeof`-tulokseen:

```javascript
function process(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'object') {
    return value.name?.toUpperCase() ?? '';
  }
}
```

Jos tarvitset objektin, joka ei ole `null`, tarkista molemmat:

```javascript
if (value !== null && typeof value === 'object') { /* ... */ }
```

## Käytännössä

Älä koskaan käytä `typeof x === 'object'` yksin null-suojaukseen. TypeScriptin `strictNullChecks` auttaa, mutta runtime-koodissa eksplisiittinen `=== null` on selkein tapa.

MDN dokumentoi tämän poikkeuksen suoraan `typeof`-sivulla. Jos haluat tarkistaa, onko arvo tavallinen objekti (ei array, ei null), harkitse `Object.prototype.toString.call(value) === '[object Object]'` tai modernia `value !== null && !Array.isArray(value)`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
