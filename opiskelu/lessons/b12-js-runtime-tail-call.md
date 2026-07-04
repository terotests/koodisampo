# ES6 tail call optimization — status JS-engingeissä?

## Tilanne

Funktionaalinen koodi käyttää tail-recursive faktoriaal:

```javascript
function fact(n, acc = 1) {
  if (n <= 1) return acc;
  return fact(n - 1, n * acc); // tail call
}
fact(100000); // RangeError
```

ES6 spec lupasi tail call optimization (TCO), mutta käytännössä engine-tuki on olematon.

## Ratkaisu

**Ei laajaa tukea — älä luota TCO:hon rekursioon**. Muunna loopiksi:

```javascript
function fact(n) {
  let acc = 1;
  while (n > 1) { acc *= n; n--; }
  return acc;
}
```

## Käytännössä

Safari poisti TCO-tuen. Rekursio syvälle puu/haku: iteratiivinen stack tai trampoliini. `fact(100000)` overflowaa aina — käytä BigInt suurille luvuille.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Tail_recursion)
