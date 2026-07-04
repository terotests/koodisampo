# EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa?

## Tilanne

`EXPLAIN ANALYZE` paljastaa sort-operaation, joka spillaa levylle: `Sort Method: external merge` tai `Disk:`-rivi kertoo temp-tiedostosta. Muistisortti olisi nopeampi, mutta sort-operaation muistikatto on täynnä ennen kuin kaikki rivit mahtuvat RAM:iin.

Sort-operaatiot (ORDER BY, DISTINCT, merge join -valmistelu) käyttävät **`work_mem`** -parametria per sort-solmu. Kun raja ylittyy, PostgreSQL kirjoittaa sorttausdataa levylle `pgsql_tmp`-hakemistoon. Levy on magnitudin hitaampi kuin muistisortti.

## Ratkaisu

**work_mem session/query kohtaisesti — varovasti globaalisti** on oikea GUC.

```sql
SET work_mem = '256MB';
EXPLAIN (ANALYZE, BUFFERS) SELECT ... ORDER BY ...;
RESET work_mem;
```

`work_mem` rajoittaa sort/hash-muistia **per operaatio**. Yhdessä kyselyssä voi olla useita sort-solmuja — jokainen voi käyttää enintään `work_mem` verran. Globaali nosto `postgresql.conf`:ssa vaikuttaa kaikkiin yhteyksiin ja voi aiheuttaa OOM:n, jos monta raskasta kyselyä ajetaan rinnakkain.

`maintenance_work_mem` vaikuttaa VACUUMiin ja CREATE INDEX -operaatioihin — ei SELECT-sorttiin.

## Tuotannossa

Nosta ensin yhdelle raportille session-tasolla. Jos `Disk` katoaa EXPLAINista, harkitse pysyvää nostoa maltillisesti. Mittaa temp file -koko (`pg_stat_database.temp_bytes`).

Pysyvä ratkaisu voi olla indeksi sort orderlle tai pienempi result set — `work_mem` on usein paikkaus.
