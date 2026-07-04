# Haluat lokittaa hitaat queryt tuotannossa. postgresql.conf?

## Tilanne

Tuotantodatabasessa hitaat kyselyt ilmenevät käyttäjinä valituksina, timeouteina ja kasvavina latensseina — mutta ilman lokidataa et tiedä mikä SQL on syyllinen. Kehitysympäristössä voit ajaa `EXPLAIN ANALYZE` vapaasti; tuotannossa tarvitset kevyen, jatkuvan tavan kaapata vain ongelmalliset suoritukset.

Kaikkien statementien lokitus (`log_statement = all`) täyttää levyn ja hidastaa I/O:ta. Tarvitset parametria, joka lokittaa kyselyn **vasta kun se ylittää kestokynnysarvon**. Näin normaali OLTP-kuorma pysyy lokin ulkopuolella ja näet käytännössä vain hitaat queryt.

## Ratkaisu

**log_min_duration_statement = esim. 1000ms — lokittaa hitaat kyselyt** on oikea `postgresql.conf`-asetus. Arvo on millisekunteina; `-1` poistaa ominaisuuden (oletus), positiivinen luku aktivoi kynnyslokituksen.

```ini
log_min_duration_statement = 1000
log_line_prefix = '%t [%p] %u@%d '
```

PostgreSQL kirjoittaa lokiin hitaan statementin tekstin automaattisesti. Tämä on virallinen slow query -lokitus ilman erillisiä extensioneja.

Yhdistä keskitetty lokitus (journald, CloudWatch, Loki) ja tarvittaessa `pg_stat_statements` aggregaatioon.

## Tuotannossa

Aloita konservatiivisella kynnysarvolla (500–1000 ms) ja laske tarvittaessa. Liian matala arvo tuottaa silti paljon lokia aktiivisessa järjestelmässä.

`log_statement = all` lokittaa kaikki statementit riippumatta kestosta — eri parametri, vältä tuotannossa. `log_duration = on` lisää keston kaikille kyselyille mutta ei suodata.
