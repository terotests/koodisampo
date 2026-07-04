# Varoitus: 'database must be vacuumed within 200 million transactions'. Mitä teet?

## Tilanne

PostgreSQL varoittaa anti-wraparound vacuum -velasta. 200 miljoonaa transaktiota jäljellä ennen pakotettua toimenpidettä. Tämä on vakavampi vaihe kuin varhainen varoitus — autovacuum freeze ei ole pitänyt XID-ikää kurissa.

## Ratkaisu

**Pakollinen anti-wraparound vacuum:**

```sql
VACUUM FREEZE;
-- tai kohdistettu:
VACUUM (FREEZE, VERBOSE) critical_table;
```

Selvitä samalla: miksi autovacuum ei ehdi (`pg_stat_progress_vacuum`, pitkät transaktiot, `autovacuum_max_workers` liian pieni). Wraparound-shutdown estää kaikki komennot paitsi VACUUM — ennaltaehkäisy on pakollinen.

## Taustaa

200M vs 10M varoitukset ovat eskalointivaiheita samaan ongelmaan. Seuraa `pg_database.datfrozenxid` ja `age()`.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
