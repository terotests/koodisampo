# DELETE job poistaa miljoona riviä — pitkä lock. Miten batch delete?

## Tilanne

`DELETE FROM logs WHERE created_at < '2023-01-01'` — yksi iso DELETE pitää lukkoja, tuottaa miljoonia dead tupleja kerralla, bloattaa taulun ja hidastaa tuotantoa.

## Ratkaisu

**Eräpoisto** pienissä erissä:

```sql
DELETE FROM logs
WHERE id IN (
  SELECT id FROM logs
  WHERE created_at < '2023-01-01'
  LIMIT 10000
);
-- toista kunnes 0 rows
```

Edistyneempi: **`FOR UPDATE SKIP LOCKED`** worker-kuvio — useat prosessit poistavat eri rivejä ilman blokkausta:

```sql
DELETE FROM logs WHERE id IN (
  SELECT id FROM logs
  WHERE created_at < '2023-01-01'
  FOR UPDATE SKIP LOCKED
  LIMIT 5000
);
```

## Taustaa

Batch delete vähentää lock-aikaa, autovacuum ehtii paremmin per erä, ja tuotantokuorma pysyy tasaisempana.

[Lue lisää](https://www.postgresql.org/docs/current/sql-delete.html)
