# POST /api/fetch-preview hakee käyttäjän antaman URL:n. Hyökkääjä antaa http://169.254.169.254/latest/meta-data/. Mikä riski?

## Tilanne

Link preview -endpoint hakee käyttäjän antaman URL:n. Hyökkääjä antaa:

`http://169.254.169.254/latest/meta-data/`

## Ratkaisu

**SSRF** (Server-Side Request Forgery).

- Salli vain http/https
- Estä private IP:t, localhost, link-local ja metadata-osoitteet
- Tee DNS-resolve ja IP-tarkistus juuri ennen yhteyttä
- Älä seuraa redirectejä sokkona
- Käytä allowlistaa, jos mahdollista

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
