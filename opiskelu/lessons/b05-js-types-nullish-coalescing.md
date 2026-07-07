# Laskuri voi palauttaa arvon 0, joka on validi. Oletusarvon 10 pitää käyttää vain kun arvo puuttuu (null/undefined), ei kun se on nolla. Mikä operaattori eroaa `||`:sta tässä?

## Tilanne

Ilmoituspalkki näyttää lukumäärän API-vastauksesta:

```javascript
const { count } = await fetchNotifications();
const display = count || 10; // "näytä vähintään 10"? — väärin!
```

Kun käyttäjällä on nolla lukematonta ilmoitusta, `count` on `0`. Falsy-tarkistus `||` korvaa sen arvolla `10`, ja käyttäjä näkee "10 uutta" — vaikka ei ole yhtään.

Oletusarvo pitäisi tulla vain, jos API ei palauta arvoa ollenkaan (`null`/`undefined`), ei kun arvo on nolla.

## Ratkaisu

**value ?? 10 — nullish coalescing** korvaa vain puuttuvan arvon:

```javascript
const display = count ?? 10;
// count === 0     →  0
// count === null  →  10
// count === undefined  →  10
```

Jos nollaa ei koskaan haluta näyttää, käsittele se erikseen:

```javascript
const display = count ?? 0;
if (display === 0) hideBadge();
```

## Käytännössä

Tämä on yksi yleisimmistä `||`- vs `??`-sekaannuksista. Tarkista kaikki oletusarvot, joissa nolla, tyhjä merkkijono tai `false` voivat olla validi API-vastaus.

MDN: nullish coalescing on turvallinen oletusarvo-operaattori numeerisille ja boolean-kentille.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
