# Kirjautuneille käyttäjille palautetaan HTML-sivuja ilman turva-headereita. Mitä lisäisit ensimmäisenä?

## Tilanne

HTML-sivuja palautetaan ilman turva-headereita.

## Riski

Puuttuvat security headerit heikentävät XSS-, clickjacking- ja tiedonsiirtosuojaa.

## Miksi tämä on vaarallista

Headerit ovat defense-in-depth, eivät korvaa authz-tarkistuksia, output encodingia tai CSRF-suojausta. Ilman niitä selain käyttää heikompia oletuksia.

## Väärä korjaus

"Lisää nämä headerit ja olet turvassa" — headerit täydentävät muuta suojausta, eivät korvaa sitä.

`Access-Control-Allow-Origin: *` ei korvaa CSP:tä.

`Cache-Control: public` voi vuotaa kirjautuneen käyttäjän dataa jaettuun välimuistiin (CDN, proxy) — HTTPS ei estä tätä, koska TLS voi päättyä välikerrokseen. Katso [`prod-sec-cache-control`](/docs/topics/security#prod-sec-cache-control).

## Parempi korjaus

Lisää ensimmäisenä:

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000
```

CSP:

- Aloita report-only-moodilla, jos sovellus on iso: `Content-Security-Policy-Report-Only: ...`
- Vältä `script-src 'unsafe-inline'` ja `script-src *`

HSTS:

- HSTS vain HTTPS-tuotantoon, ei sokkona localhost/dev-ympäristöön
- Älä lisää `includeSubDomains` sokkona, jos kaikki subdomainit eivät varmasti tue HTTPS:ää

## Tuotantohuomiot

Security headers täydentävät XSS-suojaa — OWASP Secure Headers. Testaa CSP report-only -vaiheessa ennen pakottavaa policyä.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
