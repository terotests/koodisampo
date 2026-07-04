# UPDATE-heavy taulu — levy kasvaa vaikka rivimäärä sama. Syy ja toimenpide?

## Tilanne

Tuotantotaulussa rivimäärä pysyy vakaana (~5M), mutta levykäyttö kasvaa kuukausittain. UPDATE-heavy kuorma luo **dead tupleja** — PostgreSQL MVCC säilyttää vanhat riviversiot, kunnes vacuum siivoaa ne.

Levy "kasvaa" vaikka data ei kasva — klassinen bloat-oire.

## Ratkaisu

**Dead tuple -bloat.** Autovacuum vapauttaa tilan uudelleen käyttöön saman taulun sisällä:

```sql
SELECT n_dead_tup, last_vacuum, last_autovacuum
FROM pg_stat_user_tables WHERE relname = 'orders';
```

Jos `n_dead_tup` kasvaa ja `last_autovacuum` on vanha, tarkista autovacuum-asetukset ja pitkät transaktiot. `VACUUM` (tai autovacuum) merkitsee dead tuplet vapaaiksi — **ei palauta levytilaa OS:lle** ilman `VACUUM FULL` / `pg_repack`.

## Taustaa

Bloat on normaali MVCC-sivutuote. Ratkaisu alkaa autovacuumin toimivuudesta, ei heti VACUUM FULL:sta.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
