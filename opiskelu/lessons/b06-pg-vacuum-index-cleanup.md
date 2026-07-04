# VACUUM ei vapauta levytilaa indexeistä — bloat jatkuu. Mitä parametria?

## Tilanne

Normaali VACUUM siivoaa dead tuplet heapista, mutta **indeksit voivat paisua** erikseen — erityisesti UPDATE-heavy kuormassa. Levytila ei palaudu, vaikka `VACUUM` ajetaan.

## Ratkaisu

1. **`vacuum index_cleanup`** (PG 14+ oletus päällä) — siivoaa indeksien dead pointerit vacuumin yhteydessä
2. Pahasti paisuneet indeksit: **`REINDEX INDEX CONCURRENTLY`** tai `pg_repack`

```sql
VACUUM (INDEX_CLEANUP ON) bloated_table;
REINDEX INDEX CONCURRENTLY idx_bloated;
```

Indeksi-bloat voi vaatia REINDEX:in, vaikka heap-vacuum onnistuisi.

## Taustaa

Heap ja indeksit bloatat erillään. Index-only scan -tehokkuus kärsii indeksibloatista.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)
