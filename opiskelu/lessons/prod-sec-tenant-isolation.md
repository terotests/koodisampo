# POST /api/reports ottaa tenant_id:n request bodysta. Raportti cachetetaan avaimella `report:last-month`. Admin (acme) pyytää tenant_id: other-company. Mikä meni pieleen?

## Tilanne

Admin kuuluu organisaatioon acme. Endpoint ottaa tenantin request bodysta:

```http
POST /api/reports
{ "tenant_id": "other-company", "range": "last-month" }
```

Raportti generoidaan ja cachetetaan avaimella `report:last-month` — ilman tenant-etuliitettä.

## Riski

Tämä on tenant isolation -bugi. Multi-tenant-sovelluksessa tenant on turvaraja, ei tavallinen filtteriparametri.

## Miksi tämä on vaarallista

`tenant_id` ei saa tulla luotettuna käyttäjän syötteestä. Oikea tenant johdetaan autentikoidusta sessiosta/tokenista ja käyttäjän jäsenyyksistä.

`WHERE tenant_id = currentTenantId` pitää olla kaikkialla: lukemisessa, kirjoittamisessa, raporteissa, exporteissa, background jobeissa ja admin-työkaluissa. Cache-avaimet ilman tenant-etuliitettä vuotavat dataa tenantien välillä:

```txt
# vaarallinen
cache key: report:last-month

# turvallisempi
cache key: tenant:acme:report:last-month
```

## Väärä korjaus

"Validoidaan vain, että `tenant_id` on olemassa tietokannassa" — ei riitä. Käyttäjä voi pyytää olemassa olevan toisen tenantin dataa.

"Globaali admin saa lukea kaikkien tenantien datan" — vain jos tämä on eksplisiittinen, auditoitu ja erillinen super-admin-malli. Tavallinen org-admin ei saa nähdä muiden asiakkaiden dataa.

## Parempi korjaus

- Johda tenant käyttäjän autentikoidusta kontekstista
- Tarkista, että käyttäjällä on jäsenyys/rooli kyseisessä tenantissa
- Tee tenant-rajaus tietokantakyselyssä, ei vain controllerissa
- Älä ota `tenant_id`:tä suoraan bodysta luotettuna arvona
- Varmista myös background jobit, raportit, exportit ja cache-avaimet tenant-kohtaisiksi

## Testit

- acme-admin ei saa lukea, luoda, muuttaa eikä exportata other-companyn dataa
- Sama käyttäjä kahdessa tenantissa näkee vain oikean tenantin cachetun raportin
- Background job ei käsittele tenant A:n dataa tenant B:n kontekstissa

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Multitenant_Security_Cheat_Sheet.html)
