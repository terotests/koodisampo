# Rahansiirto vähentää saldoa yhdeltä tililtä ja lisää toiselle. Toinen päivitys epäonnistuu kesken. Mitä tarvitaan?

## Tilanne

Maksujärjestelmässä rahansiirto näyttää yksinkertaiselta: vähennä lähettäjän saldoa, lisää vastaanottajan saldoa. Kehittäjä toteuttaa sen kahdella erillisellä SQL-kyselyllä ilman transaktiota:

```sql
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
-- Verkkokatko tai levyvirhe tässä välissä
UPDATE accounts SET balance = balance + 100 WHERE id = 99;
```

Ensimmäinen päivitys onnistuu, mutta toinen epäonnistuu — esimerkiksi tietokantayhteys katkeaa, levy täyttyy tai vastaanottajatili on lukittu. Lähettäjältä on jo vähennetty 100 €, mutta vastaanottaja ei saa rahaa. Järjestelmässä on nyt 100 € "kadonnut" ilman että kukaan huomaa heti.

Ilman atomisuutta osittain onnistunut operaatio on pahempi kuin täysi epäonnistuminen: virhe on hiljainen, asiakaspalveluun tulee valituksia ja manuaalinen korjaus vaatii audit-jäljen selvittämistä. Tuotannossa tällaiset virheet näkyvät usein vasta kuukauden loppusaldossa tai tiliotteiden täsmäytyksessä.

## Ratkaisu

**Wrapaa molemmat tilipäivitykset yhteen transaktioon — COMMIT vain onnistuessa.**

ACID-transaktio varmistaa atomisuuden: joko molemmat päivitykset tallentuvat tai kumpikaan ei. PostgreSQL (ja muut relaatiotietokannat) tarjoavat tähän `BEGIN` / `COMMIT` / `ROLLBACK` -mallin:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
UPDATE accounts SET balance = balance + 100 WHERE id = 99;
COMMIT;
```

Jos toinen `UPDATE` epäonnistuu, koko transaktio perutaan (`ROLLBACK`) ja ensimmäinen vähennys peruuntuu automaattisesti. Saldo pysyy johdonmukaisena. ACID-transaktio varmistaa atomisuuden — PostgreSQL transactions.

## Käytännössä

Rahansiirroissa käytä aina tietokantatransaktiota tai vastaavaa yksikköä (esim. `@Transactional` Springissä, `with conn.transaction()` Pythonissa). Lisää invarianttitarkistukset: `balance >= 0` ennen commitia ja tarvittaessa rivilukitus (`SELECT ... FOR UPDATE`), jotta kaksi samanaikaista siirtoa eivät ylikirjoita toisiaan.

Älä pidä transaktiota auki ulkoisen API-kutsun ajan. Tee DB-muutokset lyhyessä transaktiossa ja käytä tarvittaessa outbox-patternia tapahtumien lähettämiseen commitin jälkeen. Code reviewissa kysy aina: "Mitä tapahtuu jos toinen askel epäonnistuu kesken?"

[Lue lisää](https://www.postgresql.org/docs/current/tutorial-transactions.html)
