# Palkkakuitin PDF: Cache-Control: public, max-age=86400. Mikä riski?

## Tilanne

Palkkakuitin PDF palautetaan headerilla:

```http
Cache-Control: public, max-age=86400
```

Sovellus on salasanan takana ja käyttää HTTPS:ää.

## Riski

Yksityinen, käyttäjäkohtainen data voi päätyä **jaettuihin välimuisteihin** — CDN:ään, reverse proxyyn, yrityksen TLS-inspection-proxyyn tai selaimen välimuistiin.

`public` tarkoittaa käytännössä: tämän saa tallentaa myös jaettu välimuisti, ei vain käyttäjän omaan cacheen.

## Miksi SSL ei poista riskiä

**SSL/TLS suojaa tiedonsiirtoa matkalla**, mutta se ei yksin määrää, **saako vastausta tallentaa välimuisteihin**.

HTTPS estää tavallista verkon välissä olevaa tahoa lukemasta liikennettä. Mutta kun vastaus on purettu päätepisteessä tai luotetussa välikerroksessa, se voidaan silti tallentaa esimerkiksi:

1. käyttäjän selaimen levy-/muistivälimuistiin,
2. yrityksen proxyyn, jos liikennettä puretaan yrityksen TLS-inspectionissa,
3. CDN:ään tai reverse proxyyn, jos sovellus käyttää sellaista,
4. palvelimen edessä olevaan cache-kerrokseen, jos se noudattaa `public`-ohjetta.

### TLS voi päättyä CDN:ään

SSL/TLS suojaa yhteyden kahden TLS-päätepisteen välillä. CDN tai reverse proxy voi olla yksi niistä päätepisteistä.

Tyypillinen tuotantoarkkitehtuuri ei ole aina:

```text
selain ──HTTPS──> oma applikaatiopalvelin
```

vaan usein:

```text
selain ──HTTPS──> CDN / reverse proxy ──HTTPS tai HTTP──> oma applikaatiopalvelin
```

Kun selain lähettää HTTPS-pyynnön CDN:lle, TLS-yhteys päättyy CDN:ään. CDN purkaa liikenteen selväkieliseksi, jotta se voi lukea URL:n, headerit, evästeet, cache-säännöt ja mahdollisesti tallentaa vastauksen välimuistiin. Sen jälkeen CDN voi avata uuden yhteyden origin-palvelimelle.

CDN ei ole "mies välissä" hyökkääjänä, vaan luotettu välityskerros — mutta se **näkee vastauksen sisällön** ja tekee cache-päätöksen HTTP-headereiden perusteella.

### Vaaraskenaario: web cache leak

```text
1. Alice kirjautuu sisään.
2. Alice lataa /payslip.pdf tai /api/payslip?id=123.
3. Origin palauttaa PDF:n headerilla:
   Cache-Control: public, max-age=86400
4. CDN purkaa HTTPS-vastauksen, näkee PDF:n ja tallentaa sen cacheen.
5. Myöhemmin Bob tai hyökkääjä pyytää samaa cache-avainta vastaavaa URL:ia.
6. Jos CDN:n cache-avain ei erottele käyttäjää oikein, CDN voi palauttaa Alicen PDF:n
   ilman että originilta kysytään uudestaan.
```

Tätä kutsutaan usein **web cache leak**- tai **web cache deception** -riskiksi: yksityinen data päätyy jaettuun cacheen ja tulee saataville väärässä kontekstissa.

## Väärä korjaus

"HTTPS riittää — liikenne on salattu, joten `public` on ok" — TLS suojaa kuljetusta, ei sitä mitä vastaukselle saa tehdä kuljetuksen jälkeen.

"Salasana suojaa pääsyn sovellukseen" — se ei automaattisesti estä välikerrosta tallentamasta sovelluksen vastausta.

`public` nopeuttaa latausta — PDF on staattinen joten se on ok — palkkakuitti on käyttäjäkohtaista arkaluonteista dataa, ei yleistä staattista sisältöä.

## Parempi korjaus

Arkaluonteisille käyttäjäkohtaisille vastauksille (palkkakuitti, lasku, henkilötiedot, terveystieto, sopimus):

```http
Cache-Control: no-store
Pragma: no-cache
```

Usein riittää myös:

```http
Cache-Control: private, no-store
```

`private` sanoo, ettei jaettu cache saa tallentaa vastausta. `no-store` sanoo, ettei sitä pitäisi tallentaa mihinkään cacheen.

Vähemmän herkälle datalle lyhyt yksityinen cache voi olla riittävä:

```http
Cache-Control: private, max-age=300
```

**Palkkakuitti-PDF:lle älä käytä `public` missään tapauksessa.**

## Tuotantohuomiot

SSL on välttämätön, mutta se suojaa kuljetusta; `Cache-Control` suojaa sitä, mitä vastaukselle saa tehdä kuljetuksen jälkeen. CDN:ssä data ei välttämättä ole "salaamattomana levyllä" kaikissa toteutuksissa, mutta sovellustason turvallisuuden kannalta ratkaisevaa on, että CDN:llä on pääsy vastauksen selväkieliseen sisältöön ja se voi palvella sen uudelleen HTTP-cache-logiikan perusteella.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
