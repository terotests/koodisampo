# Config `timeout: 0` korvautuu oletuksella 5000 koska koodi käyttää `||`. Korjaus?

## Tilanne

Sovelluksen asetukset yhdistetään oletuksiin ennen HTTP-pyyntöjä:

```javascript
const defaults = { timeout: 5000, retries: 3 };
const config = { ...defaults, ...userConfig };

// userConfig = { timeout: 0 }  →  halutaan "ei timeoutia"
const timeout = config.timeout || 5000;
console.log(timeout); // 5000 — väärin!
```

Operaattori `||` palauttaa oikean puolen arvon, jos vasen on *falsy*: `0`, `''`, `false`, `null`, `undefined`, `NaN`. Nolla on tässä tapauksessa tarkoituksellinen arvo ("älä odota"), mutta koodi tulkitsee sen puuttuvaksi.

Sama ongelma toistuu porteissa (`port: 0`), laskureissa (`count: 0`) ja tyhjissä merkkijonoissa, joita ei haluta korvata oletuksella.

## Ratkaisu

**?? korvaa vain null/undefined — säilyttää arvon 0 oletuksena** nullish coalescing -operaattorilla:

```javascript
const timeout = config.timeout ?? 5000;
// timeout: 0  →  0
// timeout: undefined  →  5000
```

Koko config-yhdistelmä kannattaa tehdä samalla periaatteella:

```javascript
function mergeConfig(user, defaults) {
  return {
    timeout: user.timeout ?? defaults.timeout,
    retries: user.retries ?? defaults.retries,
  };
}
```

## Käytännössä

Käytä `??` kun oletusarvo tulee vain puuttuvan arvon (`null`/`undefined`) tilalle. Käytä `||`, kun haluat korvata *kaikki* falsy-arvot — esimerkiksi tyhjän merkkijonon placeholder-tekstillä UI:ssa.

MDN: nullish coalescing on ES2020-ominaisuus, ja se toimii hyvin yhdessä optional chainingin kanssa: `user.settings?.timeout ?? 5000`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
