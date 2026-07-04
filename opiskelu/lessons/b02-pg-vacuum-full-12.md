# Disk nearly full — harkitset VACUUM FULL tuotannossa. Riski?

## Tilanne

Levytila kriittinen — taulu on paisunut dead tupleista. DBA ehdottaa `VACUUM FULL` päiväsaikaan nopeaan tilan palautukseen. Operaatio kuulostaa loogiselta, mutta riskit ovat merkittävät.

## Ratkaisu

**VACUUM FULL ottaa exclusive lockin** ja kirjoittaa koko taulun uudelleen — tuotannossa:

- Taulu on **lukittu** koko operaation (INSERT/UPDATE/DELETE/SELECT blokkaantuu)
- Kesto voi olla **tunteja** isolla taululla
- Tuplaa tilan tarvetta transientisti (vanha + uusi kopio)

Suositeltu: **`pg_repack`** off-peak-aikana (online repack ilman pitkää exclusive lockia) tai uusi instanssi + migraatio. VACUUM FULL tuotannossa päivällä on yleensä hylättävä.

## Taustaa

Normaali `VACUUM` siivoaa dead tuplet mutta ei shrinkaa tiedostoa. VACUUM FULL shrinkaa — mutta hinnalla.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)
