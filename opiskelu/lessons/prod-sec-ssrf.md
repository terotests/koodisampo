# POST /api/fetch-preview hakee käyttäjän antaman URL:n. Hyökkääjä antaa http://169.254.169.254/latest/meta-data/. Mikä riski?

## Tilanne

Link preview -endpoint hakee käyttäjän antaman URL:n. Hyökkääjä antaa:

`http://169.254.169.254/latest/meta-data/`

## Riski

**SSRF** (Server-Side Request Forgery) — palvelin tekee pyynnön sisäverkkoon tai pilven metadata-API:in.

## Miksi tämä on vaarallista

Palvelin ei ole selain — CORS ei suojaa. Hyökkääjä käyttää palvelinta proxyna sisäisiin resursseihin: metadata-osoitteet, localhost, private IP:t ja sisäiset palvelut.

Localhost ei ole vain `localhost`:

```txt
127.0.0.1
::1
0.0.0.0
localhost
2130706433
0177.0.0.1
internal DNS names
```

## Väärä korjaus

"DNS rebinding on ainoa riski" — SSRF on laajempi kuin rebinding.

"HTTP-redirect riittää estämään hyökkäyksen" — redirect voi ohjata sisäverkkoon.

"Validoi host kerran ennen yhteyttä" — DNS rebinding voi vaihtaa IP:n myöhemmin.

## Parempi korjaus

- Salli vain http/https
- Estä private IP:t, localhost, link-local ja metadata-osoitteet
- Tee DNS-resolve ja IP-tarkistus juuri ennen yhteyttä
- Tarkista IP myös jokaisen redirectin jälkeen
- Suojaudu DNS rebindingiltä: älä validoi hostia kerran ja yhdistä myöhemmin eri IP:hen
- Älä seuraa redirectejä sokkona
- Käytä allowlistaa, jos mahdollista

## Tuotantohuomiot

SSRF-blokkaus ei ole yksi tarkistus vaan ketju: scheme, DNS, IP, redirectit ja mahdollinen egress-proxy. Testaa myös pilven metadata-endpointit ja sisäiset hostname:t.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
