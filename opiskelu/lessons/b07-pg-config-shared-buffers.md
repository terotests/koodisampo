# Uusi DB-palvelin 32 GB RAM — shared_buffers oletuksessa. Tyypillinen lähtöarvo?

## Tilanne

Uusi dedicated PostgreSQL-palvelin (32 GB RAM) asennetaan oletusasetuksilla. `shared_buffers` on usein 128 MB — selvästi liian pieni. PostgreSQLin oma page cache on minimaalinen, cache hit ratio jää matalaksi ja levy-I/O kasvaa turhaan.

Ensimmäinen konfigurointivaihe dedikoituun DB-koneeseen on asettaa `shared_buffers` järkevään suhteeseen RAM:iin. Tämä on perusta ennen indeksien hienosäätöä, `work_mem`-nostoja tai query-refaktorointia.

Muutos vaatii restartin — suunnittele se maintenance-ikkunaan.

## Ratkaisu

**Noin 25 % RAM — esim. 8 GB, testaa ja mittaa workloadin mukaan** on yleinen lähtökohta Linux-dedicated DB:lle.

```ini
shared_buffers = 8GB
```

32 GB × 25 % ≈ 8 GB. PostgreSQL dokumentaatio suosittelee murto-osaa RAM:ista, ei koko muistia — OS page cache tarvitsee tilaa, ja kaksoiscache voi hidastaa jos `shared_buffers` on liian suuri.

Seuraa restartin jälkeen: `blks_hit / (blks_hit + blks_read)` (`pg_stat_database`), I/O-latenssi, swap. Säädä hienovaraisesti ylös tai alas mittausten perusteella.

## Taustaa

Aseta samalla `effective_cache_size` plannerille (shared + OS cache -arvio, esim. 24 GB). Nämä toimivat eri tarkoituksissa: `shared_buffers` varaa muistia, `effective_cache_size` on vain hint suunnittelijalle.

Windows-asennuksissa suositukset poikkeavat — tarkista platform-specific docs.
