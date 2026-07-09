# POST /api/charge Idempotency-Key: abc123 — sama pyyntö lähetetään kahdesti verkko-ongelman takia. Miksi avain on tärkeä?

## Tilanne

Sama `POST /api/charge` lähetetään kahdesti: `Idempotency-Key: abc123`. Verkko-ongelman tai client-retryn takia palvelin voi nähdä saman pyynnön useamman kerran.

## Riski

Ilman idempotencyä kaksoisveloitus on mahdollinen. Replay/idempotency on erityisen tärkeä maksuissa ja webhookeissa.

## Miksi tämä on vaarallista

Idempotency key estää saman toiminnon toistumisen vahingossa tai replay-tilanteessa. Pelkkä avain headerissa ei riitä — palvelimen pitää tallentaa ja tarkistaa se oikein.

## Väärä korjaus

"Tallenna vain key ilman payloadia" — sama key eri sisällöllä voi johtaa väärään tulokseen tai piiloon ristiriitaan.

"Key korvaa JWT:n" — autentikointi ja idempotency ovat eri asioita.

## Parempi korjaus

Tallenna:

- idempotency key
- käyttäjä/tenant
- endpoint tai operation
- request payloadin hash
- lopputulos/status
- response tai viittaus luotuun resurssiin
- TTL

Säännöt:

- Sama key + sama payload → palauta sama tulos
- Sama key + eri payload → 409 Conflict / idempotency error
- Eri käyttäjän sama key → eri namespace, ei törmäystä

Jos sama käyttäjä lähettää saman idempotency keyn eri payloadilla, palvelimen pitää palauttaa virhe, ei suorittaa uutta maksua.

## Tuotantohuomiot

Mitä jos ensimmäinen pyyntö jäi kesken? Tallenna tila atomisesti ennen sivuvaikutusta tai käytä unique constraintia. Vastaa onnistuneesta duplikaatista samalla tuloksella, jotta client ei jää retry-loopiin.

[Lue lisää](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
