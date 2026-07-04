# Iso tuotantotaulu — CREATE INDEX lukitsee kirjoitukset. Miten luot indeksin ilman pitkää lukkoa?

## Tilanne

DBA ajaa `CREATE INDEX idx_foo ON big_table (foo);` tuotannossa. Muutama minuutti later Slack täyttyy timeout-virheistä — normaali CREATE INDEX on ottanut lukon, joka estää concurrent INSERT/UPDATE/DELETE -operaatiot indeksin rakennusvaiheessa.

Iso taulu + normaali CREATE INDEX = pitkä write-seisokki.

## Ratkaisu

```sql
CREATE INDEX CONCURRENTLY idx_foo ON big_table (foo);
```

**Ei exclusive lockia kirjoituksille** koko rakennusajaksi. Hinta: kaksinkertainen tauluskannaus, pidempi kesto, enemmän WAL:ia, ja mahdollinen `INVALID` indeksi virhetilanteessa.

Aja maintenance-ikkunassa silti — CONCURRENTLY kuormittaa I/O:ta. Seuraa `pg_stat_progress_create_index`.

## Taustaa

Kolme saman aiheen kysymystä eri vaikeustasolla — ydin on aina sama: tuotantoon CONCURRENTLY, dev/testiin normaali CREATE INDEX riittää.

[Lue lisää](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
