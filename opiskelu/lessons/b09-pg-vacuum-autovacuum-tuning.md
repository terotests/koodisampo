# Heavy UPDATE -taulu bloataa nopeammin kuin autovacuum ehtii. Säätö?

## Tilanne

UPDATE-intensiivinen taulu tuottaa dead tupleja nopeammin kuin oletusautovacuum ehtii siivota. Bloat kasvaa viikoittain — skaalautuvuusongelma, ei yksittäinen incident.

## Ratkaisu

Aggressiivisemmat **taulukohtaiset storage-parametrit**:

```sql
ALTER TABLE hot_table SET (
  autovacuum_vacuum_scale_factor = 0.02,
  autovacuum_vacuum_threshold = 1000,
  autovacuum_analyze_scale_factor = 0.02
);
```

Tai globaali `autovacuum_vacuum_scale_factor` pienemmäksi. Harkitse myös FILLFACTOR HOT-päivityksille ja batch UPDATE -kuvioita.

## Taustaa

Autovacuum tuning on standardi UPDATE-heavy tauluille. Mittaa `n_dead_tup / n_live_tup` suhde ennen ja jälkeen.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html)
