# API hylkää vain `if (token == null) return unauthorized()`. Mikä arvo pääsee läpi virheellisesti?

## Tilanne

Autentikointimiddleware tarkistaa tokenin minimalistisesti:

```javascript
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  verify(token);
  next();
}
```

Tämä estää `null` ja `undefined` — mutta tyhjä merkkijono `''` ei ole kumpikaan. `'Bearer '` header ilman tokenia tuottaa `token === ''`, joka läpäisee tarkistuksen ja päätyy `verify('')` -kutsuun.

## Ratkaisu

Tyhjä merkkijono **'' — ei ole null eikä undefined, joten == null ei laukea**. Korjaa validointi:

```javascript
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token == null || token === '') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  verify(token);
  next();
}

// Parempi: tyyppi + pituus
if (typeof token !== 'string' || token.length === 0) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## Käytännössä

`== null` on hyvä tapa tarkistaa sekä `null` että `undefined` kerralla, mutta se ei riitä merkkijonoille. Auth-koodissa kirjoita validointi eksplisiittisesti — älä luota falsy- tai null-tarkistukseen yksin.

MDN equality comparisons selittää `== null` -idiomin ja sen rajat.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
