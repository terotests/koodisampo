# EXPLAIN ANALYZE näyttää korkean execution timen mutta ei kerro onko hitto disk I/O. Lisälippu?

## Tilanne

Kysely kestää 30 sekuntia `EXPLAIN ANALYZE` -tulosteessa, mutta et tiedä, johtuuko hidastus levyltä lukemisesta, CPU:sta (monimutkainen laskenta) vai temp spillistä. Ilman I/O-erottelua saatat optimoida väärää asiaa — esim. lisätä indeksiä, vaikka data olisi jo cachessa.

## Ratkaisu

Lisää **BUFFERS**-lippu:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Tuloste erottelee:

- `shared hit` — data PostgreSQLin buffer cachesta tai OS cachesta
- `shared read` — blokkia luettiin levyltä
- `temp read/written` — sort/hash spill levylle

Korkea execution time + korkea `shared read` → I/O-ongelma (indeksi, cache, kylmä data). Korkea time + korkea hit, vähän read → CPU tai algoritmi (join-järjestys, laskenta).

## Käytännössä

Aja warm cache -mittaus toistamalla kysely: jos toisella ajolla `read` putoaa lähelle nollaa mutta aika pysyy korkeana, pullonkaula on laskennassa — ei levylle.

[Lue lisää](https://www.postgresql.org/docs/current/sql-explain.html)
