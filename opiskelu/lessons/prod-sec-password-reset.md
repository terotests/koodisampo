# Reset-linkki: /reset?token=123456 — 6-numeroinen token, voimassa 24 h. Mikä ongelma?

## Tilanne

`/reset?token=123456` — 6 numeroa, voimassa 24 h.

## Ratkaisu

- Token liian pieni avaruus — brute force mahdollinen
- Voimassaoloaika liian pitkä
- Token tallennetaan hashattuna
- Token on kertakäyttöinen
- Onnistumisen jälkeen vanhat sessiot voidaan mitätöidä
- Reset-pyynnön vastaus ei paljasta, löytyikö sähköpostiosoite

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
