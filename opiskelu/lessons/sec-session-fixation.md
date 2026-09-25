# Sovellus käyttää kirjautumisen jälkeen samaa session-id:tä kuin ennen kirjautumista. Hyökkääjä voi asettaa uhrille tuntemansa id:n. Mikä korjaus?

## Tilanne

Sovellus luo session jo ensimmäisellä sivulatauksella ja säilyttää saman session-id:n kirjautumisen jälkeen. Hyökkääjä hankkii itselleen session-id:n, saa sen uhrin selaimeen (esim. alidomainin kautta asetetulla cookiella tai URL-parametrilla) ja odottaa, että uhri kirjautuu. Sen jälkeen hyökkääjällä on kirjautunut istunto.

## Ratkaisu

Luo **uusi session-id aina, kun oikeustaso muuttuu**: kirjautuessa, uloskirjautuessa ja esimerkiksi admin-tilaan siirryttäessä. Vanha id mitätöidään palvelimella.

```js
// Express + express-session
req.session.regenerate((err) => {
  if (err) return next(err);
  req.session.userId = user.id;
  res.redirect("/");
});
```

Lisäksi cookie `HttpOnly`, `Secure`, `SameSite=Lax` (tai Strict), eikä session-id:tä koskaan hyväksytä URL:sta.

## Taustaa

Session fixationissa hyökkääjän ei tarvitse arvata tai varastaa id:tä, koska hän on asettanut sen itse. Siksi id:n pituus tai salaus ei auta. Kun kirjautuminen vaihtaa id:n, hyökkääjän tuntema arvo menettää merkityksensä.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#renew-the-session-id-after-any-privilege-level-change)
