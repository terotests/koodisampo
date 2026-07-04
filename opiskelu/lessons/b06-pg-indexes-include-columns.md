# Index-only scan ei toteudu — query tarvitsee sarakkeet jotka ei indexissä. Miten?

## Tilanne

`EXPLAIN` näyttää Index Scan + Heap Fetches jokaiselle riville. WHERE käyttää indeksiä `(status)`, mutta SELECT palauttaa `id`, `name`, `email` — vain `status` on indeksissä. Index Only Scan ei voi toteutua, koska puuttuvat sarakkeet pakottavat heap-käynnin.

## Ratkaisu

PostgreSQL 11+ **INCLUDE**-sarakkeet:

```sql
CREATE INDEX ON users (status) INCLUDE (id, name, email);
```

Search key pysyy `(status)`, SELECT-sarakkeet leaf-sivuilla. Kun visibility map on ajan tasalla, planner valitsee Index Only Scan.

Vaihtoehto vanhemmissa versioissa: lisää kaikki sarakkeet avaimen osaksi (isompi indeksi, huonompi selectivity).

## Taustaa

Covering index vähentää satunnaista I/O:ta read-heavy kyselyissä merkittävästi. Mittaa `Heap Fetches` ennen ja jälkeen.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
