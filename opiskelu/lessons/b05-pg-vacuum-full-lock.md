# DBA ehdottaa VACUUM FULL tuotantotaululle päivällä. Miksi vastustat?

## Tilanne

Bloat on todellinen ongelma — taulu vie 10 GB, live data 2 GB. DBA ehdottaa `VACUUM FULL orders` keskellä päivää nopeaan tilanpalautukseen.

## Ratkaisu

**VACUUM FULL ottaa exclusive lockin** — koko operaation ajan:

- Kaikki DML blokkaantuu
- SELECT voi blokkaantua riippuen versiosta ja lockista
- Kesto tunteja isolla taululla
- Tuplaa levytilaa transientisti

Vastustus perusteltu: käytä **pg_repack** yöllä, partition swap, tai uusi taulu + cutover. VACUUM FULL on "break glass" -toimenpide, ei päiväsaian ylläpito.

## Taustaa

Normaali VACUUM ei shrinkaa tiedostoa — VACUUM FULL shrinkaa mutta lockkaa. Ymmärrä ero ennen DBA-päätöstä.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)
