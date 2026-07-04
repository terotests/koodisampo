# Suuri taulu — autovacuum ei käynnisty tarpeeksi tiukasti. Mitä säätää?

## Tilanne

500 GB taulussa oletus `autovacuum_vacuum_scale_factor = 0.2` tarkoittaa: vacuum vasta kun 100 GB on dead tupleja — liian myöhään. Autovacuum "ei ehdi" koska kynnys on korkea.

## Ratkaisu

**autovacuum_vacuum_scale_factor** — taulukohtainen tai globaali:

```sql
ALTER TABLE big_table SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_vacuum_threshold = 50000
);
```

Vacuum trigger: `threshold + scale_factor * reltuples`. Pienempi scale_factor → vacuum useammin. Isot taulut tarvitsevat alhaisemman factorin kuin oletus 0.2.

## Taustaa

Globaali `autovacuum_vacuum_scale_factor` sopii pienille tauluille. Suurille aseta taulukohtaiset storage-parametrit.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html)
