# Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus?

## Tilanne

Utility-funktio luokittelee arvot:

```javascript
function describe(value) {
  if (typeof value === 'object') {
    return `Objekti, avaimia: ${Object.keys(value).length}`;
  }
  return typeof value;
}

describe(null); // TypeError: Cannot convert undefined or null to object
```

`typeof null === 'object'` on ES1-ajan bugi, joka on säilynyt yhteensopivuuden vuoksi. Kehittäjät luottavat `typeof`-tarkistukseen, ja null putoaa objektihaaraan — jossa `Object.keys(null)` kaataa.

## Ratkaisu

**value === null tai value == null — null/undefined erikseen typeofista:**

```javascript
function describe(value) {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    return `Objekti, avaimia: ${Object.keys(value).length}`;
  }
  return typeof value;
}

// Tai yhdistetty null/undefined-tarkistus:
if (value == null) {
  return value === null ? 'null' : 'undefined';
}
```

## Käytännössä

Tarkista `null` aina ennen `typeof value === 'object'`. TypeScriptin `strictNullChecks` estää osan näistä, mutta runtime-validoinnissa eksplisiittisyys on pakko.

MDN dokumentoi `typeof null`-poikkeuksen. Käytä `value !== null && typeof value === 'object'` kun tarvitset oikean objektin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
