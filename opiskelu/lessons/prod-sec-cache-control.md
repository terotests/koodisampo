# Palkkakuitin PDF: Cache-Control: public, max-age=86400. Mikä riski?

## Tilanne

Palkkakuitin PDF: `Cache-Control: public, max-age=86400`

## Ratkaisu

Yksityinen data voi päätyä jaettuihin välimuisteihin.

```http
Cache-Control: no-store
Pragma: no-cache
```

Tai tilanteesta riippuen: `Cache-Control: private, max-age=300`

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
