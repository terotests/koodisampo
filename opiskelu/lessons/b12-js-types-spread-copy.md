# Haluat kopioda taulukon ilman että muokkaat alkuperäistä pushilla. Nopea tapa?

## Tilanne

Komponentti saa props-taulukon ja lisää siihen uuden rivin:

```javascript
function addItem(original) {
  original.push(newItem); // BUG: mutatoi alkuperäistä!
  return original;
}
```

React/Vue/Svelte havaitsee muutoksen väärin, koska viite pysyy samana. Immutable-päivitys vaatii uuden taulukon — mutta `original.slice()` tai `[].concat(original)` on vanhanaikaista.

## Ratkaisu

**const copy = [...original]** spread-operaattori luo matalan kopion:

```javascript
function addItem(original) {
  return [...original, newItem];
}

// Poisto
const without = original.filter(item => item.id !== removeId);

// Yhdistäminen
const merged = [...listA, ...listB];
```

Spread kopioi ylimmän tason — sisäkkäiset objektit jaetaan edelleen (sama viite).

## Käytännössä

Syvä kopio vaatii `structuredClone(original)` tai kirjaston. Spread on nopein tapa taulukon kopioimiseen ja päivittämiseen funktionaaliseen tyyliin.

MDN: spread toimii myös objekteissa `{ ...defaults, ...overrides }`. ES2015-ominaisuus, tuettu kaikkialla.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
