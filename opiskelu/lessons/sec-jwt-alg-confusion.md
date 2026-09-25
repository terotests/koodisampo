# JWT-kirjasto hyväksyy tokenin otsikossa ilmoitetun algoritmin sellaisenaan. Hyökkääjä lähettää tokenin, jossa `alg` on `none` tai RS256:n sijaan HS256. Mikä korjaus?

## Tilanne

API tarkistaa JWT:n näin:

```js
const payload = jwt.verify(token, publicKey); // algoritmi luetaan tokenin otsikosta
```

Hyökkääjä muokkaa tokenin otsikkoa:

- `"alg": "none"`, eikä tokenissa ole allekirjoitusta. Huolimaton kirjasto hyväksyy sen.
- `"alg": "HS256"` ja allekirjoittaa tokenin HMAC:lla käyttäen avaimena palvelimen **julkista** RSA-avainta. Jos kirjasto käyttää annettua avainta sellaisenaan HMAC-avaimena, allekirjoitus täsmää.

## Ratkaisu

**Päätä algoritmi palvelimella**, älä tokenin perusteella:

```js
const payload = jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
  audience: "api.example.com",
  issuer: "https://auth.example.com",
});
```

Käytä ajantasaista kirjastoa, joka hylkää `none`-algoritmin oletuksena, ja pidä epäsymmetriset ja symmetriset avaimet erillään.

## Taustaa

Tokenin otsikko on hyökkääjän hallussa ennen kuin allekirjoitus on tarkistettu. Jos kirjasto antaa otsikon valita tarkistustavan, hyökkääjä valitsee helpoimman. Avaimen pidentäminen tai tokenin salaaminen ei muuta tätä.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
