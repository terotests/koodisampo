# EXPLAIN (ANALYZE, BUFFERS) näyttää korkeat shared_blks_read. Mitä WAL/FPI tarkoittaa?

## Tilanne

Kyselyssä `Buffers: shared read=500000` — paljon levyluvuja. Samalla WAL-kirjoitus on korkea ja I/O-spikeja näkyy checkpointin jälkeen. EXPLAIN kertoo buffer-tason I/O:n, mutta taustalla voi olla **write amplification** checkpoint- ja WAL-mekanismien kautta.

## Ratkaisu

**FPI (Full Page Image)** WAL-merkinnässä tarkoittaa, että PostgreSQL kirjoittaa koko 8 KB sivun WAL:iin ensimmäisen muutoksen jälkeen checkpointin jälkeen — ei vain delta-muutosta. Tämä suojaa crash recoverya, mutta lisää WAL- ja levymäärää.

Korkea `shared_blks_read` EXPLAINissa viittaa siihen, että data ei ollut cachessa — cold read. FPI liittyy **kirjoituksiin**, ei suoraan read-heavy SELECT:iin, mutta checkpoint flushaa likaisia sivuja levylle ja voi aiheuttaa I/O-spikeja, jotka vaikuttavat myös luku-kyselyihin.

Diagnostiikka:

- `EXPLAIN (ANALYZE, BUFFERS)` — read vs hit
- `pg_stat_bgwriter` — checkpoint-tahti
- `track_io_timing = on` + `pg_stat_statements` — I/O-aika vs CPU

## Taustaa

BUFFERS näyttää queryn omat buffer-käytöt. WAL/FPI on klusteritason kirjoituspolitiikka — ymmärrä molemmat, kun I/O-spikeja selvitetään.

[Lue lisää](https://www.postgresql.org/docs/current/sql-explain.html)
