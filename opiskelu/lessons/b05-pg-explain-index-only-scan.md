# EXPLAIN: Index Scan + Heap Fetches jokaiselle riville. Miten saat Index Only Scan?

## Tilanne

Kysely hakee `id` ja `email` WHERE `status = 'active'`. Indeksi `(status)` on olemassa, mutta suunnitelma on `Index Scan` ja `Heap Fetches: 50000` — jokaiselle matching-riville erillinen heap-luku. Latenssi kasvaa satunnaisen I/O:n vuoksi.

Index Only Scan palauttaa sarakkeet suoraan indeksilehdistä ilman heap-käyntiä, kun visibility map sallii.

## Ratkaisu

1. **Covering-indeksi** — sisällytä SELECT-sarakkeet:

```sql
CREATE INDEX ON users (status) INCLUDE (id, email);
```

2. **Pidä visibility map ajan tasalla** — `VACUUM` / autovacuum UPDATE-kuormassa.

3. Varmista suunnitelma:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, email FROM users WHERE status = 'active';
-- Index Only Scan, Heap Fetches: 0 (tai hyvin pieni)
```

Pelkkä btree `(status)` riittää WHERE:lle, mutta ei SELECT-listan sarakkeille — siksi heap fetch jokaiselle riville.

## Taustaa

PostgreSQL 11+ `INCLUDE`-sarakkeet tekevät covering-indeksin ilman search key -muutoksia. Index Only Scan on merkittävä I/O-voitto read-heavy raporteissa.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
