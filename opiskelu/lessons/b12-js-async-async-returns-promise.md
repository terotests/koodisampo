# Mikä `async function foo() { return 42; }` palauttaa kutsujalle?

## Tilanne

Koodikatselmoinnissa kysytään: mitä tämä palauttaa kutsujalle?

```javascript
async function foo() {
  return 42;
}
```

Toinen kehittäjä väittää, että se palauttaa numeron 42 suoraan — kuten tavallinen funktio.

## Ratkaisu

**Promise, joka resolvaantuu arvoon 42:**

```javascript
async function foo() {
  return 42;
}

const result = foo();
console.log(result); // Promise { <pending> }

const value = await foo();
console.log(value); // 42
```

Async-funktio wrapaa return-arvon automaattisesti Promise.resolve():en. Heitetty virhe → rejected promise.

## Käytännössä

Älä sekoita `foo()` (Promise) ja `await foo()` (42). TypeScript: return type on `Promise<number>`, ei `number`. Callback-kutsuissa tarvitset .then() tai await.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
