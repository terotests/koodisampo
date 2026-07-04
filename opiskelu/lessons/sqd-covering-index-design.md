# Indeksi `(status)` mutta kysely hakee myös `name` ja `email`. Miten vältät tauluhaut?

## Tilanne

Asiakaslistaus hakee aktiiviset asiakkaat:

```sql
SELECT name, email
FROM customers
WHERE status = 'active';
```

Indeksi `(status)` auttaa löytämään aktiiviset rivit, mutta `name` ja `email` eivät ole indeksissä. Jokaiselle osumalle PostgreSQL tekee heap fetchin (Index Scan + Table Lookup) — miljoonalla aktiivisella asiakkaalla se on miljoona satunnaista levylukua.

Index-only scan ei toimi, koska indeksi ei sisällä pyydettyjä sarakkeita — visibility map -tarkistuksesta huolimatta heap-käynti on väistämätön ilman covering-indeksiä.

## Ratkaisu

**Covering index `INCLUDE (name, email)` — palauttaa sarakkeet indeksistä:**

```sql
CREATE INDEX customers_active_covering
ON customers (status)
INCLUDE (name, email);
```

Kysely pysyy samana:

```sql
SELECT name, email
FROM customers
WHERE status = 'active';
```

PostgreSQL voi nyt tehdä index-only scanin: `status`-ehdon arviointi ja `name`/`email`-palautus tapahtuvat indeksistä ilman tauluhakua (kun visibility map on kunnossa). Covering index palauttaa sarakkeet indeksistä — design + performance yhdistelmä.

Lisää vain tarvittavat sarakkeet INCLUDE-listaan — liian leveä indeksi hidastaa kirjoituksia.

## Käytännössä

Seuraa `EXPLAIN`-tulosteessa `Index Only Scan` vs `Index Scan`. Jos näet `Heap Fetches: N` suurella N:llä, harkitse INCLUDE-sarakkeita tai `VACUUM`-tilannetta.

Partial index aktiivisille: `CREATE INDEX ... ON customers (name, email) WHERE status = 'active'` jos aktiivisia on pieni osuus — pienempi indeksi kuin koko `(status) INCLUDE`.

Covering-indeksit kasvattavat indeksin kokoa — punnitse read-heavy vs write-heavy -työkuorma. Mittaa ennen/jälkeen `pg_stat_user_indexes` ja `idx_blks_read`.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
