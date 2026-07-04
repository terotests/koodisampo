# Uusi dedicated DB-palvelin 32 GB RAM — shared_buffers alussa oletus. Tyypillinen lähtöarvo?

## Tilanne

Dedicated PostgreSQL-palvelin 32 GB RAM:lla käynnistyy oletusasetuksilla. `shared_buffers` on tyypillisesti 128 MB — liian pieni tuotantokuormaan. Cache hit ratio jää matalaksi, levy-I/O kasvaa, ja ensimmäinen optimointiehdotus DBA:lle kohdistuu muistiparametreihin ennen query-tuningia.

`shared_buffers` on PostgreSQLin keskitetty page cache. Se varaa oikeaa muistia ja vaatii **restartin** muutoksesta. Siksi lähtöarvo kannattaa asettaa oikein heti, sitten hienosäätää mittausten perusteella.

## Ratkaisu

**Noin 25 % RAM — esim. 8 GB, testaa ja mittaa pg_stat_bgwriterilla** on tyypillinen lähtöarvo.

```ini
shared_buffers = 8GB
```

PostgreSQL tuning -ohjeet suosittelevat murto-osaa fyysisestä muistista dedikoituun DB-palvelimeen. Koko 32 GB `shared_buffers`:iin **ei** kannata — OS page cache tarvitsee tilaa hot dataan, ja liian suuri arvo voi hidastaa.

Restartin jälkeen seuraa `pg_stat_bgwriter` (buffers written, checkpoints) ja cache hit ratio. Säädä workloadin mukaan — OLTP vs analytics vaikuttaa optimiarvoon.

## Taustaa

`effective_cache_size` asetetaan yleensä samalla (planner-hint, esim. 24 GB). `shared_buffers` varaa muistia; `effective_cache_size` ei.

Cloud-managed Postgres voi rajoittaa muutoksia — tarkista providerin parametrirajat.
