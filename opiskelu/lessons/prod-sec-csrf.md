# Selain lähettää session-cookien automaattisesti myös haitalliselta sivulta tulevaan POST-pyyntöön. Mikä suoja?

## Tilanne

Käyttäjä on kirjautuneena pankkisovellukseen. Hyökkääjä houkuttelee hänet toiselle sivulle, joka lähettää piilotetun lomakkeen:

```html
<form action="https://bank.example/transfer" method="POST">
  <input name="amount" value="10000">
</form>
```

Selain liittää session-cookien automaattisesti — palvelin luulee pyynnön aitoksi. Tämä on **CSRF (Cross-Site Request Forgery)**.

## Ratkaisu

Kerroksittainen suoja:

1. **CSRF-token** — palvelin generoi salaisen tokenin lomakkeeseen; ulkopuolinen sivu ei tiedä sitä.
2. **SameSite-cookie** — `Set-Cookie: session=...; SameSite=Lax` (tai `Strict`) rajoittaa cross-site -lähetystä.
3. **Origin/Referer-tarkistus** tilallisiin muutoksiin (POST, DELETE).

```http
Set-Cookie: session=abc; Secure; HttpOnly; SameSite=Lax
```

## Käytännössä

API:t, jotka käyttävät pelkkää Bearer-tokenia headerissa (ei cookiea), eivät ole alttiita klassiselle CSRF:lle samalla tavalla. Cookie-pohjaisissa sessioissa käytä ensisijaisesti frameworkin CSRF-suojausta / CSRF-tokenia. SameSite-cookie on hyvä lisäsuoja, mutta sitä ei kannata pitää ainoana suojana kaikissa sovelluksissa. Älä tee tilaa muuttavia toimintoja GET-pyynnöllä. OWASP CSRF Prevention Cheat Sheet on hyvä tarkistuslista.

[Lue lisää](https://owasp.org/www-community/attacks/csrf)
