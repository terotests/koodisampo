# Equality-haku UUID-sarakkeessa — btree on hidas suurilla tauluilla. Milloin hash index?

## Tilanne

Kysely `WHERE session_id = 'uuid-here'::uuid` hakee yhden rivin. B-tree toimii, mutta joku ehdottaa hash-indeksiä nopeampaan equality-hakuun. Hash-indeksi on niche-työkalu — ymmärrä rajoitukset ennen käyttöä.

## Ratkaisu

**Hash-indeksi sopii vain `=` -vertailuun** — ei range scan, ei ORDER BY, ei LIKE. PostgreSQL 10+ hash-indeksit ovat WAL-turvallisia ja crash-safe.

```sql
CREATE INDEX ON sessions USING HASH (session_id);
```

Käytännössä **btree on usein riittävä** UUID equality-haulle — hash voi olla hieman pienempi, mutta btree on joustavampi. Hash kannattaa harvoin, ellei profilointi näytä selkeää voittoa.

## Taustaa

"Hash on hidas suurilla tauluilla" on harhaanjohtava — ongelma on yleensä seq scan ilman indeksiä. Valitse hash vain, jos tarvitset pelkkää equalitya ja haluat minimoida indeksikoon.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-types.html#INDEXES-TYPES-HASH)
