# ES6 tail call optimization — status JS-engingeissä?

## Tilanne

Funktionaalinen koodi käyttää tail-rekursiivista kertomafunktiota:

```javascript
function fact(n, acc = 1) {
  if (n <= 1) return acc;
  return fact(n - 1, n * acc); // tail call
}
fact(100000); // RangeError
```

ES6-spesifikaatio määrittelee strict mode -koodille proper tail callit (TCO), mutta käytännössä vain Safari (JavaScriptCore) toteuttaa ne. V8 (Chrome, Node.js) ja SpiderMonkey (Firefox) eivät tue niitä.

## Ratkaisu

**Ei laajaa tukea — älä luota TCO:hon syvässä rekursiossa**. Muunna loopiksi:

```javascript
function fact(n) {
  let acc = 1;
  while (n > 1) { acc *= n; n--; }
  return acc;
}
```

## Käytännössä

V8 kokeili TCO:ta lipun takana, mutta poisti toteutuksen. Koodi, joka toimii Safarissa, voi siis kaatua Chromessa. Syvä rekursio (puu/haku): iteratiivinen pino tai trampoliini. Huom: näin suuren luvun kertoma ylittää Numberin rajan (`Infinity`) — käytä BigIntiä, jos tarvitset tarkan tuloksen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Tail_recursion)
