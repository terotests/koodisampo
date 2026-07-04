# for-silmukassa `var i` vuotaa loopin ulkopuolelle. Turvallisempi vaihtoehto?

## Tilanne

Klassinen bugi vanhassa koodissa:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Tulostaa: 3, 3, 3 — ei 0, 1, 2

console.log(i); // 3 — i on näkyvissä loopin ulkopuolella!
```

`var` on funktio-scoped (tai globaali), ei lohkoscoped. Silmukan ulkopuolella `i` on edelleen olemassa ja arvossa 3. Closuret timeout-funktioissa viittaavat samaan muuttuvaan `i`:hin.

## Ratkaisu

**let — lohkoscoped muuttuja** rajoittaa `i`:n silmukan lohkoon:

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Tulostaa: 0, 1, 2

console.log(i); // ReferenceError — i ei ole määritelty
```

Jokaisella `for`-iteraatiolla on oma `i`-sidoitus closureja varten.

## Käytännössä

Käytä aina `let` silmukkamuuttujissa. `const` sopii, jos iterointimuuttuja ei muutu (esim. `for (const item of items)`). `var` on legacy — ESLint `no-var` estää sen.

MDN: `let` ja `const` ovat block-scoped ES6:sta lähtien. Tämä korjaa myös monia closure-bugeja automaattisesti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
