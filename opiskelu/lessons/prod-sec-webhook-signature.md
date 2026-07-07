# POST /webhooks/payment — backend luottaa bodyyn { invoiceId, paid: true } ilman allekirjoituksen tarkistusta. Mikä puuttuu?

## Tilanne

`POST /webhooks/payment` — backend luottaa bodyyn ilman allekirjoitusta.

## Ratkaisu

Webhookin aitous tarkistetaan allekirjoituksella:

- Käytä raw bodyä allekirjoituksen tarkistukseen
- Tarkista timestamp / replay-ikkuna
- Tee käsittely idempotentiksi
- Älä luota pelkkään IP-osoitteeseen

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)
