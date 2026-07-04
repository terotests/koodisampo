# Funktio `sum(...nums)` — mitä ...nums tarkoittaa?

## Tilanne

Yleiskäyttöinen laskentafunktio ottaa mielivaltaisen määrän argumentteja:

```javascript
function sum(...nums) {
  // nums on ??? — miten käsitellä argumentit?
  return nums.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3);    // 6
sum(10, 20);     // 30
sum();           // 0
```

Ennen ES6:tta käytettiin `arguments`-objektia, joka on array-like mutta ei oikea taulukko — ei tue `forEach`/`map` suoraan.

## Ratkaisu

**Rest parameter kerää loput argumentit taulukoksi** — `...nums` funktion parametreissa:

```javascript
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}

// Yhdistettynä tavallisiin parametreihin
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
log('ERROR', 'Connection failed', 'Retrying...');
```

Rest täytyy olla viimeinen parametri.

## Käytännössä

Älä sekoita rest (`...nums` parametreissa) ja spread (`...arr` arvoissa) — sama syntaksi, eri rooli. Spread hajottaa taulukon: `Math.max(...numbers)`.

MDN: rest parameter korvaa `arguments` modernissa koodissa. Se kerää vain ylimääräiset argumentit — ei nimettyjä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
