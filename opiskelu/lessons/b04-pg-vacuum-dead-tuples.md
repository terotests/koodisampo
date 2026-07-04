# pg_stat_user_tables näyttää n_dead_tup kasvavan nopeasti UPDATE-heavy taulussa. Toimenpide?

## Tilanne

UPDATE-heavy taulussa `n_dead_tup` kasvaa jatkuvasti `pg_stat_user_tables`:ssa. Autovacuum ajaa, mutta dead tuplet kertyvät nopeammin kuin siivous ehtii — bloat ja hidastuminen.

## Ratkaisu

1. Varmista autovacuum **käynnissä** (`autovacuum = on`)
2. Säädä taulukohtaisesti aggressiivisemmaksi:

```sql
ALTER TABLE hot_table SET (
  autovacuum_vacuum_scale_factor = 0.02,
  autovacuum_vacuum_threshold = 1000
);
```

Oletus `scale_factor = 0.2` tarkoittaa vacuum vasta 20 % dead tupleista — isoilla tauluilla liian myöhään. Tarkista myös pitkät transaktiot, jotka estävät siivousta.

## Taustaa

Dead tuple -kasvu on normaalia UPDATE:ssa. Ongelma on siivousnopeuden vs tuottavuuden suhde — säädettävissä autovacuum-parametreilla.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
