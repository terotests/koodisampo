# for (var i=0; i<3; i++) { setTimeout(() => console.log(i), 0); } tulostaa 3,3,3. Korjaus?

## Tilanne

Klassinen interview-snippet:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Tulostaa `3, 3, 3`. Kysymys: mikä on minimikorjaus?

## Ratkaisu

**let i — block scope per iteratio — tai IIFE/param capture var-ongelmaan**:

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

## Käytännössä

Sama bugi esiintyy `Promise`-ketjuissa ja event listenereissä. `var` on legacy — moderni koodi käyttää `let`/`const`. Selitä haastattelussa erot function scope vs block scope vs per-iteration binding.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
