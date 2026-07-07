# API hyväksyy JWT:n tarkistamatta `exp`- ja `aud`-kenttiä. Mikä riski?

## Tilanne

Backend validoi JWT:n allekirjoituksen ja lukee `sub`-kentän käyttäjätunnukseksi. Kehittäjä olettaa, että allekirjoituksen tarkistus riittää — `exp` (expiration) ja `aud` (audience) jätetään tarkistamatta, koska "token on kuitenkin oikein allekirjoitettu".

Kaksi konkreettista riskiä ilmenee tuotannossa:

1. **Vanhentunut token:** Käyttäjä kirjautui ulos tai token mitätöitiin viikkoja sitten, mutta `exp`-tarkistuksen puuttuessa vanha token toimii edelleen rajattoman ajan (tai kunnes avain kierrätetään).

2. **Väärä audience:** Sama identiteettipalvelu myöntää tokeneita sekä admin-API:lle (`aud: admin-api`) että mobiilisovellukselle (`aud: mobile-app`). Mobiilitoken hyväksytään admin-endpointissa, koska allekirjoitus on validi — vaikka token on tarkoitettu toiseen palveluun.

Molemmat ovat autentikaatio- ja valtuutusaukkoja, jotka eivät näy yksinkertaisessa "token valid?" -testissä.

## Ratkaisu

**Vanhentunut tai väärälle aud:lle myönnetty token voidaan hyväksyä edelleen.**

Palvelimen on validoitava tämän käyttötapauksen kannalta relevantit claimit: allekirjoitus ja algoritmi, `exp`, odotettu `aud`, odotettu `iss` sekä tarvittaessa `nbf`, `iat` ja `scope`/`roles`. RFC 7519 määrittelee näiden claimien merkityksen; sovellus päättää, mitkä ovat sen turvallisuusmallissa pakollisia.

Esimerkki tarkistuslogiikasta (pseudo):

```
claims = verifyJwt(token, {
  issuer: "https://auth.example.com",
  audience: "admin-api",
  algorithms: ["RS256"],
  jwks: trustedJwks
})

if claims.exp <= now:
    reject()
```

Lisäksi tuotannossa:

- Älä hyväksy tokenin headerista algoritmia sokkona; salli vain odotettu algoritmi.
- Tarkista `kid` JWKS-avaimista turvallisesti.
- Käytä pientä clock skew -toleranssia `exp`/`nbf`-tarkistuksissa.
- Älä käytä `assert`-lausetta tuotantovalidointiin esimerkkipseudossakaan, koska monissa kielissä assertit voidaan poistaa käytöstä.

## Käytännössä

Käytä vakiintunutta kirjastoa (esim. `jose`, `jsonwebtoken`, `PyJWT`) oletusasetuksilla jotka tarkistavat `exp` automaattisesti — älä ohita claim-validointia. Määrittele `aud` ja `iss` eksplisiittisesti konfiguraatiossa per ympäristö. Security reviewissa tarkista: "Mitä claimseja tämä endpoint oikeasti validoi?" Pelkkä allekirjoitus ei riitä.

[Lue lisää](https://datatracker.ietf.org/doc/html/rfc7519)
