# Auth-bugi: `if (token)` hyväksyy minkä tahansa truthy-arvon, esim. `1` tai `{}`, vaikka tokenin pitää olla ei-tyhjä merkkijono. Turvallisempi tarkistus?

## Tilanne

Middleware tarkistaa tokenin ennen reititystä:

```javascript
function auth(req, res, next) {
  const token = req.body.token ?? req.headers['x-token'];
  if (token) {
    verify(token);
    return next();
  }
  return res.status(401).send('Unauthorized');
}
```

Tämä näyttää järkevältä, mutta `if (token)` hyväksyy minkä tahansa truthy-arvon. Jos token tulee JSON-bodysta, hyökkääjä voi lähettää `1`, `true` tai `{}` — kaikki ovat truthy, ja ne päätyvät `verify`-funktiolle, joka odottaa merkkijonoa.

Truthy-tarkistus kertoo vain, ettei arvo ole falsy. Se ei kerro, mikä tokenin *tyypin* pitäisi olla, eikä takaa, että merkkijono on ei-tyhjä.

## Ratkaisu

**Eksplisiittinen validointi: typeof token === 'string' && token.length** kertoo tarkalleen, mitä hyväksyt:

```javascript
function auth(req, res, next) {
  const raw = req.body.token ?? req.headers['x-token'];
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

Turvallisuuskriittisissä paikoissa vältä pelkkää `if (value)`- tai `if (!value)`-tarkistusta ja kirjoita validointi eksplisiittisesti. Zod, Joi tai TypeScriptin runtime-validointi auttavat, mutta perusperiaate on sama: tarkista tyyppi ja sisältö erikseen.

MDN:n truthy/falsy-opas on hyödyllinen, mutta älä käytä truthy/falsy-logiikkaa validoinnin sijaan.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
