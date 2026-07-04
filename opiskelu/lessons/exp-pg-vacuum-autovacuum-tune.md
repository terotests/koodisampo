# Heavy UPDATE -taulu bloataa nopeasti — autovacuum ei käynnisty tarpeeksi usein. Säätö?

## Tilanne

Expert-tason skenaario: UPDATE-kuorma tuottaa dead tupleja nopeammin kuin oletusautovacuum trigger (20 % taulusta) sallii. Bloat kasvaa viikossa — skaalautuvuusongelma tuotannossa.

## Ratkaisu

**autovacuum_vacuum_scale_factor** tai taulukohtaiset storage-parametrit:

```sql
ALTER TABLE sessions SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_vacuum_threshold = 5000
);
```

Laske trigger manuaalisesti: `5000 + 0.01 × reltuples`. 10M rivin taulussa vacuum ~100k dead tuple jälkeen vs oletus 2M.

## Taustaa

Expert-kysymys korostaa taulukohtaista säätöä globaalin sijaan — eri taulut, eri kuorma.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html)
