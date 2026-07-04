# 16 GB RAM palvelin — shared_buffers on 128MB oletus. Tyypillinen lähtösuositus?

## Tilanne

Tuore PostgreSQL-asennus käyttää usein konservatiivista `shared_buffers`-oletusta (128 MB). 16 GB RAM -palvelimella se on selvästi liian pieni: PostgreSQLin oma page cache on minimaalinen, ja suuri osa luvuista menee suoraan levylle tai jää OS cacheen ilman optimaalista PG-käyttäytymistä.

Matala cache hit ratio (`blks_read` korkea suhteessa `blks_hit`) on ensimmäinen oire. Ennen indeksien lisäämistä DBA:n pitää asettaa järkevä lähtöarvo `shared_buffers`:ille — tyypillisesti murto-osa koneen RAM:ista, ei oletus eikä koko muisti.

## Ratkaisu

**Noin 25 % RAM:sta (esim. 4 GB) — aloitusarvo, säädä mittausten perusteella** on PostgreSQL-yhteisön ja dokumentaation suositus dedikoituun DB-palvelimeen.

```ini
shared_buffers = 4GB
```

128 MB → 4 GB parantaa usein hit ratioa merkittävästi. Muutos vaatii **restartin**. Seuraa sen jälkeen `pg_stat_database` ja I/O-metriikoita — tavoite korkea hit ratio ilman swap-paineita.

Koko 16 GB `shared_buffers`:iin **ei** kannata: OS page cache tarvitsee tilaa, ja kaksoiscache voi hidastaa.

## Taustaa

Windows-ympäristössä suositukset poikkeavat (pienempi `shared_buffers`). Linux dedikoitu DB: ~25 % lähtö, sitten hienosäätö.

`effective_cache_size` asetetaan yleensä samalla kertaa (shared + OS cache -arvio plannerille).
