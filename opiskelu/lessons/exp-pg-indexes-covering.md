# EXPLAIN näyttää Index Scan mutta silti heap fetch jokaiselle riville SELECT listassa. Miten vältät extra I/O:n?

## Tilanne

Indeksi nopeuttaa WHERE-ehtoa, mutta SELECT-listan sarakkeet eivät ole indeksissä. Jokainen matching-rivi aiheuttaa heap fetchin — satunnainen I/O kymmenille tuhansille riveille.

Index Scan ≠ Index Only Scan. Ero on SELECT-sarakkeiden sijainnissa indeksissä.

## Ratkaisu

**INCLUDE-sarakkeet** covering-indeksiin:

```sql
CREATE INDEX ON products (category_id) INCLUDE (name, price, sku);
```

PostgreSQL 11+ `INCLUDE` pitää search keyn `(category_id)` erillään palautettavista sarakkeista. Index Only Scan välttää heap-käynnin, kun visibility map on ajan tasalla.

Mittaa: `Heap Fetches: 0` (tai lähellä) `EXPLAIN (ANALYZE, BUFFERS)` -tulosteessa.

## Taustaa

Covering index on read-optimointi — write-kustannus kasvaa hieman. Sopii hot read -poluille, joissa sama kysely toistuu usein.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
