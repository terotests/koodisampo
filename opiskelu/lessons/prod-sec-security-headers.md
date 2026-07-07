# Kirjautuneille käyttäjille palautetaan HTML-sivuja ilman turva-headereita. Mitä lisäisit ensimmäisenä?

## Tilanne

HTML-sivuja palautetaan ilman turva-headereita.

## Ratkaisu

Lisää ensimmäisenä:

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

HSTS vain HTTPS-tuotantoon, ei sokkona localhost/dev-ympäristöön.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
