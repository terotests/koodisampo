# Mikä `typeof 'hello'` palauttaa?

## Tilanne

Debuggausfunktio tulostaa parametrin tyypin virhetilanteessa:

```javascript
function logType(value) {
  console.log(typeof value);
}

logType('hello');
logType(42);
logType([]);
```

`typeof` on JavaScriptin operaattori primitiivien ja funktioiden tyypin tunnistamiseen. Se on ensimmäinen työkalu, kun API palauttaa odottamattoman arvon — mutta sillä on tunnettuja poikkeuksia (`typeof null === 'object'`).

## Ratkaisu

**'string'** — `typeof` primitiivisestä merkkijonosta palauttaa merkkijonon `'string'`:

```javascript
typeof 'hello';     // 'string'
typeof "hello";     // 'string'
typeof `hello`;     // 'string' (template literal)
typeof String(42);  // 'string' (String-objekti)
typeof new String('hello'); // 'object' — wrapper-objekti!
```

Huomaa ero primitiivin ja wrapper-objektin välillä.

## Käytännössä

`typeof` palauttaa merkkijonon: `'string'`, `'number'`, `'boolean'`, `'undefined'`, `'object'`, `'function'`, `'symbol'`, `'bigint'`. Se ei erota arraya objektista — käytä `Array.isArray()`.

MDN: `typeof` on unary operaattori. Turvallisempi tarkistus merkkijonolle: `typeof value === 'string'`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
