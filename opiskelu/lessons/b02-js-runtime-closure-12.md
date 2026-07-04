# for-loopissa 10 timeoutia tulostaa kaikki 10 — klassinen bugi. Fix?

## Tilanne

Harjoitustehtävä: luot 10 painiketta, joista jokainen tulostaa oman numeronsa klikatessa:

```javascript
for (var i = 0; i < 10; i++) {
  buttons[i].addEventListener("click", () => {
    console.log(i);
  });
}
```

Kaikki napit tulostavat 10. Opiskelija ihmettelee, miksi `let`-versio toimii mutta `var` ei.

## Ratkaisu

Korjaus: **let i loopissa tai IIFE joka luo erillisen closuren jokaiselle iteraatiolle**:

```javascript
for (let i = 0; i < 10; i++) {
  buttons[i].addEventListener("click", () => console.log(i));
}

// tai var + IIFE:
for (var i = 0; i < 10; i++) {
  ((j) => {
    buttons[j].addEventListener("click", () => console.log(j));
  })(i);
}
```

## Käytännössä

Tämä on yksi JavaScriptin klassisimmista haastekysymyksistä. Tuotantokoodissa `let` on oletus. `forEach` + `let` callback-parametri on myös turvallinen vaihtoehto.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
