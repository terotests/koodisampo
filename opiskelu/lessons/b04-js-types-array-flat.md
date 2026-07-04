# Nested array [[1,[2]],3] pitää litistää yhdeksi tasoksi. Moderni metodi?

## Tilanne

CSV-import palauttaa hierarkkisen rakenteen, jossa alatasot on upotettu taulukoihin:

```javascript
const categories = [[1, [2]], 3, [4, [5, 6]]];
// Halutaan: [1, 2, 3, 4, 5, 6]
```

Vanha tapa oli rekursiivinen funktio tai `reduce` + `concat` -ketju, joka on virhealtista ja vaikeaa ylläpitää. Moni kehittäjä turvautuu lodash `flattenDeep`-funktioon ulkoiseen riippuvuuteen.

## Ratkaisu

**arr.flat(Infinity) tai flat(2) tarvittava syvyys** litistää sisäkkäiset taulukot natiivisti:

```javascript
const nested = [[1, [2]], 3, [4, [5, 6]]];

nested.flat(1);        // [1, [2], 3, 4, [5, 6]] — yksi taso
nested.flat(2);        // [1, 2, 3, 4, 5, 6]
nested.flat(Infinity); // [1, 2, 3, 4, 5, 6] — kaikki tasot
```

Tarkista syvyys etukäteen, jos rakenne on tunnettu — `flat(2)` on tehokkaampi kuin `Infinity` syvissä mutta rajatuissa rakenteissa.

## Käytännössä

`flat()` ei litistä objekteja — vain taulukoita. `flatMap()` yhdistää map + flat(1) yhdeksi operaatioksi: `[1, 2].flatMap(x => [x, x * 2])`.

MDN: `flat` on ES2019-ominaisuus. Huomaa, että se jättää aukot (holes) paikoilleen sparse-taulukoissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
