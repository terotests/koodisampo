# Varoitus: database must be vacuumed before anti-wraparound — mitä teet?

## Tilanne

PostgreSQL varoittaa anti-wraparound vacuum -velasta — pakollinen freeze-vaihe lähestyy. Jos vacuum ei ajeta, seuraa pakotettu shutdown tai komentojen hylkäys.

## Ratkaisu

**Transaction ID wraparound** — aja vacuum freeze:

```sql
VACUUM (FREEZE, VERBOSE) affected_tables;
```

Varmista autovacuum freeze -asetukset (`autovacuum_freeze_max_age`). Selvitä pitkät transaktiot. Seuraa:

```sql
SELECT datname, age(datfrozenxid) FROM pg_database;
```

Korkea age → kiire.

## Taustaa

"Before anti-wraparound" on virallinen terminologia — vacuum joka edistää datfrozenxid:ä kaikissa tauluissa.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
