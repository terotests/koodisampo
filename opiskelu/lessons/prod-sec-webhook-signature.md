# POST /webhooks/payment — backend luottaa bodyyn { invoiceId, paid: true } ilman allekirjoituksen tarkistusta. Mikä puuttuu?

## Tilanne

`POST /webhooks/payment` — backend luottaa bodyyn `{ invoiceId, paid: true }` ilman allekirjoitusta. Kuka tahansa voi POSTata endpointtiin.

## Riski

Webhookin aitous puuttuu. Ilman allekirjoitusta hyökkääjä voi merkitä laskuja maksetuiksi.

## Miksi tämä on vaarallista

IP-allowlist ei riitä (spoofing, välityspalvelin, muuttuvat provider-IP:t). HTTPS salaa liikenteen, mutta ei todista että pyyntö tuli maksupalvelulta.

## Väärä korjaus

"IP-allowlist maksupalvelun osoitteista riittää" — IP ei ole luotettava yksinään.

"JSON schema validointi korvaa allekirjoituksen" — schema ei todista lähettäjää.

## Parempi korjaus

Webhookin aitous tarkistetaan allekirjoituksella:

- Älä parsi JSONia ennen allekirjoituksen tarkistusta — raw bodyn tavut ratkaisevat
- Käytä raw bodyä allekirjoituksen tarkistukseen
- Vertaa allekirjoitus constant-time comparisonilla
- Tarkista timestamp / replay-ikkuna
- Tee käsittely idempotentiksi event ID:llä, ei vain `invoiceId`:llä
- Tue secret rotationia: vanha ja uusi secret voivat olla hetken voimassa
- Älä luota pelkkään IP-osoitteeseen

## Tuotantohuomiot

Tallenna käsitellyt event ID:t ennen sivuvaikutusta. Vastaa 2xx onnistuneesta duplikaatista, jotta lähettäjä ei jää retry-loopiin.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)
