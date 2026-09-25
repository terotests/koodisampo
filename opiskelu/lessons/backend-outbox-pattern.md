# Tilaus tallennetaan kantaan ja heti perään lähetetään viesti jonoon. Joskus viesti lähtee, vaikka transaktio peruttiin, ja joskus tilaus tallentuu ilman viestiä. Mikä malli?

## Tilanne

Tilauspalvelu tekee:

```text
1. BEGIN; INSERT INTO orders ...; COMMIT;
2. queue.publish("order.created", {...})
```

Jos prosessi kaatuu vaiheiden välissä, tilaus on tallessa, mutta varasto ja laskutus eivät koskaan kuule siitä. Jos järjestys käännetään, viesti voi lähteä tilauksesta, jonka transaktio perutaan.

## Ratkaisu

**Transactional outbox**: viesti kirjoitetaan tietokantaan samassa transaktiossa kuin liiketoimintadata, ja erillinen julkaisija lähettää sen jonoon.

```sql
BEGIN;
INSERT INTO orders (...) VALUES (...);
INSERT INTO outbox (topic, payload) VALUES ('order.created', '{...}');
COMMIT;
```

Julkaisija lukee lähettämättömät rivit (esim. `FOR UPDATE SKIP LOCKED`), julkaisee ne ja merkitsee lähetetyiksi. Vaihtoehtona change data capture (esim. Debezium lukee WAL:ia).

## Taustaa

Tietokantaa ja viestijonoa ei voi commitoida yhdessä atomisesti ilman hajautettua transaktiota. Outbox tekee viestistä osan samaa transaktiota: joko molemmat tallentuvat tai kumpikaan ei.

Julkaisija voi lähettää saman viestin kahdesti (kaatuminen julkaisun ja merkinnän välissä), joten toimitus on **vähintään kerran**, ja kuluttajien pitää olla idempotentteja (esim. viesti-id:n tarkistus).

[Lue lisää](https://microservices.io/patterns/data/transactional-outbox.html)
