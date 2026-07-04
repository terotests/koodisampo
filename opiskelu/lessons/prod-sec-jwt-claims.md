# API hyväksyy JWT:n tarkistamatta `exp`- ja `aud`-kenttiä. Mikä riski?

## Tilanne

Backend validoi JWT:n allekirjoituksen ja lukee `sub`-kentän käyttäjätunnukseksi. Kehittäjä olettaa, että allekirjoituksen tarkistus riittää — `exp` (expiration) ja `aud` (audience) jätetään tarkistamatta, koska "token on kuitenkin oikein allekirjoitettu".

Kaksi konkreettista riskiä ilmenee tuotannossa:

1. **Vanhentunut token:** Käyttäjä kirjautui ulos tai token mitätöitiin viikkoja sitten, mutta `exp`-tarkistuksen puuttuessa vanha token toimii edelleen rajattoman ajan (tai kunnes avain kierrätetään).

2. **Väärä audience:** Sama identiteettipalvelu myöntää tokeneita sekä admin-API:lle (`aud: admin-api`) että mobiilisovellukselle (`aud: mobile-app`). Mobiilitoken hyväksytään admin-endpointissa, koska allekirjoitus on validi — vaikka token on tarkoitettu toiseen palveluun.

Molemmat ovat autentikaatio- ja valtuutusaukkoja, jotka eivät näy yksinkertaisessa "token valid?" -testissä.

## Ratkaisu

**Vanhentunut tai väärälle aud:lle myönnetty token voidaan hyväksyä edelleen.**

Palvelimen on validoitava kaikki relevantit claimit: `exp` (token ei saa olla vanhentunut), `aud` (token on tarkoitettu tälle API:lle), `iss` (luotettu myöntäjä) ja allekirjoitus (`alg`, avain/jwks). RFC 7519 määrittelee nämä pakollisiksi turvalliseen käyttöön. Validoi exp, aud, iss ja allekirjoitus palvelimella — RFC 7519.

Esimerkki tarkistuslogiikasta (pseudo):

```
verify_signature(token, jwks)
assert token.exp > now()
assert token.aud == "admin-api"
assert token.iss == "https://auth.example.com"
```

## Käytännössä

Käytä vakiintunutta kirjastoa (esim. `jose`, `jsonwebtoken`, `PyJWT`) oletusasetuksilla jotka tarkistavat `exp` automaattisesti — älä ohita claim-validointia. Määrittele `aud` ja `iss` eksplisiittisesti konfiguraatiossa per ympäristö. Security reviewissa tarkista: "Mitä claimseja tämä endpoint oikeasti validoi?" Pelkkä allekirjoitus ei riitä.

[Lue lisää](https://datatracker.ietf.org/doc/html/rfc7519)
