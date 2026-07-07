# POST /api/reports ottaa tenant_id:n request bodysta. Admin kuuluu organisaatioon acme, mutta voi pyytää raportin tenant_id: other-company. Mikä meni pieleen?

## Tilanne

Admin kuuluu organisaatioon acme. Endpoint ottaa tenantin request bodysta:

```http
POST /api/reports
{ "tenant_id": "other-company", "range": "last-month" }
```

## Ratkaisu

**tenant_id ei saa tulla luotettuna käyttäjän syötteestä.**

Oikea tenant johdetaan autentikoidusta sessiosta/tokenista ja käyttäjän jäsenyyksistä. Requestissa tulevaa tenant_id:tä saa käyttää korkeintaan valinnan kohteena, jonka oikeus tarkistetaan erikseen.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Multitenant_Security_Cheat_Sheet.html)
