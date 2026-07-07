# POST /api/charge Idempotency-Key: abc123 — sama pyyntö lähetetään kahdesti verkko-ongelman takia. Miksi avain on tärkeä?

## Tilanne

Sama `POST /api/charge` lähetetään kahdesti: `Idempotency-Key: abc123`.

## Ratkaisu

Idempotency key estää saman toiminnon toistumisen vahingossa tai replay-tilanteessa.

Palvelimen pitää tallentaa key käyttäjä-/tenant-kohtaisesti pyynnön olennaisen sisällön kanssa ja palauttaa sama tulos toistopyynnölle.

[Lue lisää](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
