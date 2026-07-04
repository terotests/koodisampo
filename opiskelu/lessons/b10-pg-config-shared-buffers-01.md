# PostgreSQL cache hit ratio on matala 32 GB RAM -palvelimella. Ensimmäinen konfiguraatiomuutos?

## Tilanne

32 GB RAM -palvelimella cache hit ratio (`blks_hit / (blks_hit + blks_read)`) jää selvästi alle tavoitteen OLTP-kuormassa. Suuri osa luvuista menee levylle, vaikka koneella olisi muistia. Ensimmäinen epäily kohdistuu PostgreSQLin omaan buffer pooliin — oletus `shared_buffers` on usein 128 MB.

Ennen indeksien lisäämistä, query-refaktorointia tai `work_mem`-nostoja kannattaa varmistaa perusmuistiasetus. Muuten optimointi rakentuu hauraalle pohjalle ja I/O pysyy pullonkaulana.

## Ratkaisu

**Kasvata shared_buffers maltillisesti — esim. 25 % RAM, katso docs** on ensimmäinen konfiguraatiomuutos.

```ini
shared_buffers = 8GB
```

PostgreSQL dokumentaatio suosittelee dedikoituun DB-palvelimeen murto-osaa RAM:ista (tyypillisesti ~25 %), ei koko muistia. Muutos vaatii restartin.

Seuraa restartin jälkeen cache hit ratioa, I/O-latensseja ja swap-paineita. Liian suuri `shared_buffers` voi haitata — noudata PostgreSQL-ohjetta, älä aseta automaattisesti "kaikki RAM PG:lle".

## Taustaa

`effective_cache_size` kannattaa säätää samalla (planner-hint OS cache + shared_buffers -arvio). `work_mem` auttaa sort/hash spilliin, ei cache hit ratioon.

Matala hit ratio voi johtua myös sequential scan -raskaasta workloadista — tarkista `pg_stat_user_tables` ja query-profiili.
