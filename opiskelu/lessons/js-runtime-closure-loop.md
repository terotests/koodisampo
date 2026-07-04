# for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — mitä tulostuu?

## Tilanne

Vanha legacy-skripti ajaa silmukan ja aikatauluttaa kolme timeout-kutsua:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Oletat tulostuvan `0, 1, 2`, mutta konsoli näyttää `3, 3, 3`. `var` on funktioskooppinen: silmukan jälkeen `i` on arvossa 3, ja kaikki kolme closurea viittaavat samaan muuttujaan. Timeoutit ajetaan vasta kun silmukka on valmis, jolloin `i` on jo 3.

## Ratkaisu

Tulostuu **3, 3, 3 — var ei luo erillistä lohkoscopea iteraatiolle**. `var`-sidoitus on jaettu kaikille iteroinneille.

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

`let` luo uuden sidonnan jokaiselle iteraatiolle, joten closure näkee oikean arvon.

## Käytännössä

ESLint-sääntö `no-var` estää tämän luokan bugeja. Code reviewissa tarkista aina callbackit silmukoiden sisällä. Jos `var` on pakko, IIFE `(function(j) { ... })(i)` toimii, mutta `let` on selkeämpi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
