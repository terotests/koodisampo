# Heavy insert -taulu lähestyy wraparoundia nopeasti. Autovacuum freeze -säätö?

## Tilanne

INSERT-heavy taulu tuottaa paljon uusia transaction ID -arvoja. `pg_class.relfrozenxid` vanhenee nopeasti — wraparound-varoitus tulee aiemmin kuin odotit. Oletus `autovacuum_freeze_max_age` ei ehdi.

## Ratkaisu

Säädä **aikaisempaa freeze-kynnystä**:

```sql
ALTER TABLE hot_table SET (
  autovacuum_freeze_max_age = 100000000,
  autovacuum_freeze_table_age = 100000000
);
```

Globaalisti: `autovacuum_freeze_max_age`, `vacuum_freeze_table_age`, `vacuum_freeze_min_age` postgresql.conf:ssa. Alempi max_age → autovacuum freeze ajaa useammin → estää wraparound-kiireen.

## Taustaa

Freeze on erillinen vacuum-vaihe — merkitsee vanhat rivit frozeniksi. INSERT-heavy taulut tarvitsevat aggressiivisempaa freeze-politiikkaa kuin read-heavy.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-autovacuum.html)
