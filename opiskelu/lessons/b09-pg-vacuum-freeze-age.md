# Varoitus: `database must be vacuumed within 200 million transactions`. Toimenpide?

## Tilanne

Wraparound-varoitus 200 miljoonan transaktion etäisyydellä — vakava mutta vielä korjattavissa. Autovacuum freeze ei ole pitänyt vauhtia XID-ikään nähden.

## Ratkaisu

```sql
VACUUM FREEZE;
```

Kohdistettu kriittisille tauluille, joiden `age(relfrozenxid)` on korkein. Säädä `autovacuum_freeze_max_age` alhaisemmaksi INSERT/UPDATE-heavy tauluille. Monitoroi `pg_database.datfrozenxid`.

## Taustaa

200M on eskalointivaihe — reagoi ennen "not accepting commands" -tilaa.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
