# Taulu 10 GB mutta 2 GB live data — UPDATE-heavy workload. Ilmiö ja ratkaisu?

## Tilanne

Klassinen bloat-profiili: UPDATE tuottaa dead tupleja, normaali VACUUM siivoaa mutta **tiedosto pysyy 10 GB**. Live data ~2 GB. Suorituskyky heikkenee (enemmän sivuja skannattavana).

## Ratkaisu

**Bloat** — kaksivaiheinen ratkaisu:

1. **Operatiivinen:** paranna autovacuum (scale_factor, poista pitkät transaktiot) — estää pahenemisen
2. **Korjaava:** **`pg_repack`** off-peak tai `VACUUM FULL` — palauttaa levytilan

```sql
-- Diagnostiikka
SELECT n_live_tup, n_dead_tup, last_vacuum
FROM pg_stat_user_tables WHERE relname = 't';
```

`pgstattuple` / `pg_stat_all_tables` auttaa arvioimaan bloat-prosentin tarkemmin.

## Taustaa

Bloat on UPDATE-kuorman sivutuote. Ennaltaehkäisy (autovacuum) parempi kuin toistuva VACUUM FULL.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
