# Kaksi eri objektia {a:1} ja {a:1} — {} === {} on false. Miksi?

## Tilanne

Testi vertaa kahta konfiguraatio-objektia:

```javascript
const defaults = { theme: 'light' };
const userConfig = { theme: 'light' };

if (defaults === userConfig) {
  console.log('Samat asetukset');
} else {
  console.log('Eri asetukset'); // tämä suoritetaan
}
```

Sisältö on identtinen, mutta vertailu palauttaa `false`. Kehittäjä odottaa "deep equality" -vertailua kuten Pythonissa tai JSON.stringify-tasolla — mutta JavaScript vertaa objekteja viittauksella.

## Ratkaisu

**Objektit vertaillaan viittauksella — eri instanssit** tarkoittaa, että `===` tarkistaa onko sama muistiosoite:

```javascript
const a = { theme: 'light' };
const b = a;
a === b; // true — sama viite

const c = { theme: 'light' };
a === c; // false — eri objekti, sama sisältö

// Deep equality tarvittaessa:
JSON.stringify(a) === JSON.stringify(c); // varovasti — avainjärjestys!
// Tai structuredClone + deepEqual-kirjasto (lodash isEqual)
```

Primitiivit (`string`, `number`, `boolean`) vertaillaan arvolla — objektit ja taulukot viittauksella.

## Käytännössä

Reactin `useState` ja immuuttinen päivitys perustuvat viitevertailuun — siksi `{ ...obj }` luo uuden objektin. Map/Set vertaavat avaimia omilla säännöillään.

MDN equality comparisons erottaa SameValue (===), SameValueZero (Map) ja SameValueNonNumber.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
