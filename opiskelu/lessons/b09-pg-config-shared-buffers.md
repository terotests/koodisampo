# Uusi DB-palvelin 32 GB RAM — DBA säätää shared_buffers. Tyypillinen lähtöarvo?

## Tilanne

DBA ottaa käyttöön uuden 32 GB RAM -palvelimen PostgreSQLille. Oletus `shared_buffers` (128 MB) on liian pieni — ensimmäinen tuning-vaihe on nostaa PostgreSQLin oma page cache järkevään suhteeseen koneen muistista.

Liian pieni `shared_buffers` → matala cache hit ratio, enemmän levy-I/O:ta. Liian suuri → kilpailu OS page cachen kanssa, mahdollinen hidastuminen. Lähtöarvo perustuu yleiseen ohjeeseen, sitten mitataan workloadilla.

## Ratkaisu

**Noin 25 % RAM — PostgreSQL wiki tuning, mutta mitataan workloadilla** on oikea lähestymistapa.

```ini
shared_buffers = 8GB
```

32 GB × 25 % ≈ 8 GB on yleinen alku dedikoituun Linux-DB:hen. PostgreSQL runtime config -dokumentaatio ja wiki suosittelevat murto-osaa, ei koko RAM:ia.

Restart pakollinen. Seuraa `pg_stat_database` (blks_hit, blks_read), I/O-metriikoita ja `pg_stat_bgwriter`. Säädä ylös/alas mitattujen tulosten perusteella — ei kaavasta suoraan lopulliseen arvoon.

## Taustaa

Aseta samalla `effective_cache_size` (planner-hint, esim. 24 GB). Nämä eivät korvaa toisiaan.

Erillinen analytiikkakuorma voi hyötyä eri arvosta kuin OLTP — testaa molemmilla peak-kuormilla jos mahdollista.
