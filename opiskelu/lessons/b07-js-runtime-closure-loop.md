# for-loopissa 5 click-handleria — kaikki tulostavat 5. Klassinen bugi ja fix?

## Tilanne

Luot viisi klik-handleria silmukassa testiä varten:

```javascript
for (var i = 0; i < 5; i++) {
  document.getElementById(`btn-${i}`).addEventListener("click", () => {
    console.log("Painettu:", i);
  });
}
```

Kaikki tulostavat 5. Opettaja kysyy fixiä ilman että saat vaihtaa HTML:ää.

## Ratkaisu

**let i loopissa tai IIFE — var jakaa saman sidonnan kaikille callbackeille**:

```javascript
for (let i = 0; i < 5; i++) {
  document.getElementById(`btn-${i}`).addEventListener("click", () => {
    console.log("Painettu:", i);
  });
}
```

## Käytännössä

`let` in `for`-loop on ES2015-specifinen "per-iteration binding". Tämä poikkeaa muista lohkoista, joissa `let` on per-scope. MDN Closure-sivu on pakollinen luettava.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
