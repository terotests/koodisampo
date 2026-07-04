# Query tarvitsee id, email — index only scan halutaan. PostgreSQL 11+?

## Tilanne

Kysely hakee `id` ja `email` WHERE `status = 'active'`. Indeksi `(status)` nopeuttaa WHERE-ehtoa, mutta jokainen matching-rivi aiheuttaa heap fetchin — Index Scan lukee taulun data-sivut erikseen.

Haluat **Index Only Scan**: kaikki tarvittavat sarakkeet indeksistä ilman heap-käyntiä. PostgreSQL 11+ tarjoaa tähän `INCLUDE`-sarakkeet.

## Ratkaisu

```sql
CREATE INDEX ON users (status) INCLUDE (id, email);
```

`status` on search key (WHERE), `id` ja `email` ovat leaf-sivuilla INCLUDE:na — indeksi "kattaa" SELECT-listan. Index Only Scan vaatii lisäksi ajantasaisen visibility mapin (autovacuum).

Tarkista:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, email FROM users WHERE status = 'active';
```

## Taustaa

Ennen PG 11:ä covering-indeksi vaati kaikki sarakkeet avaimen osaksi. INCLUDE erottaa hakuehdon ja palautettavat sarakkeet — pienempi indeksi, sama hyöty.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
