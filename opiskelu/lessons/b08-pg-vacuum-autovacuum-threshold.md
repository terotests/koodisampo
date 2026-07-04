# Autovacuum ei käynnisty — dead tuples kasaantuvat. Mitä parametria?

## Tilanne

`n_dead_tup` kasvaa, mutta `last_autovacuum` ei päivity. Autovacuum-triggeriä ei saavuteta — oletuskynnys liian korkea isolle tai pienelle taululle.

## Ratkaisu

**autovacuum_vacuum_threshold + scale_factor:**

```sql
-- Globaali (postgresql.conf):
autovacuum_vacuum_threshold = 1000
autovacuum_vacuum_scale_factor = 0.05

-- Taulukohtainen:
ALTER TABLE t SET (
  autovacuum_vacuum_threshold = 500,
  autovacuum_vacuum_scale_factor = 0.01
);
```

Trigger: `threshold + scale_factor × reltuples` dead tupleja → autovacuum käynnistyy. Laske factor isolle taululle (0.01–0.05).

## Taustaa

Threshold on absoluuttinen lattia, scale_factor suhteellinen osa. Molemmat vaikuttavat triggeriin.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html)
