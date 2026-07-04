# Auth-bugi: `if (!token)` hylkää validin tyhjän merkkijonon `''` ja sallii `0`. Turvallisempi tarkistus?

## Tilanne

Middleware tarkistaa Bearer-tokenin ennen reititystä:

```javascript
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  verify(token);
  next();
}
```

Tämä näyttää järkevältä, mutta se sekoittaa kaksi eri asiaa: *puuttuvan* tokenin ja *tyhjän* tokenin. Lisäksi jos token joskus on numero `0` (buginen API), `!0` on `true` ja pyyntö hylätään virheellisesti.

Falsy-tarkistus `!token` hyväksyy kaiken paitsi falsy-arvot — mutta se ei kerro, mikä tokenin *tyypin* pitäisi olla eikä erota tyhjää merkkijonoa puuttuvasta arvosta tarkoituksenmukaisesti.

## Ratkaisu

**Eksplisiittinen validointi: typeof token === 'string' && token.length** kertoo tarkalleen, mitä hyväksyt:

```javascript
function auth(req, res, next) {
  const raw = req.headers.authorization?.replace('Bearer ', '');
  if (typeof raw !== 'string' || raw.length === 0) {
    return res.status(401).send('Unauthorized');
  }
  verify(raw);
  next();
}
```

Jos tyhjä merkkijono on virheellinen token mutta puuttuva header eri virhe, erottele ne:

```javascript
if (raw == null) return res.status(401).send('Missing token');
if (typeof raw !== 'string' || raw.trim().length === 0) {
  return res.status(401).send('Invalid token');
}
```

## Käytännössä

Turvallisuuskriittisissä paikoissa vältä `if (!value)` ja kirjoita validointi eksplisiittisesti. Zod, Joi tai TypeScriptin runtime-validointi auttavat, mutta perusperiaate on sama: tarkista tyyppi ja sisältö erikseen.

MDN:n truthy/falsy-opas on hyödyllinen, mutta älä käytä falsy-logiikkaa validoinnin sijaan.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
