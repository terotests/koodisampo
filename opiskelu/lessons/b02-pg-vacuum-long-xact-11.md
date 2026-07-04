# Autovacuum ei siivoa — pg_stat_activity näyttää idle in transaction 8h. Syy?

## Tilanne

`pg_stat_user_tables.n_dead_tup` kasvaa, mutta autovacuum ei vapauta tilaa. `pg_stat_activity` paljastaa istunnon: `state = idle in transaction`, kysely commitoimatta 8 tuntia — esim. avoin transaktio BI-työkalusta.

Autovacuum *yrittää* ajaa, mutta ei voi poistaa dead tupleja.

## Ratkaisu

**Pitkä transaktio estää vacuumia.** PostgreSQL ei voi poistaa riviversioita, jotka ovat edelleen näkyvissä vanhimmalle aktiiviselle transaktiolle (xmin). Selvitä:

```sql
SELECT pid, xact_start, state, query
FROM pg_stat_activity
WHERE state IN ('idle in transaction', 'active')
ORDER BY xact_start;
```

Päätä tai rollbackaa pitkä transaktio → autovacuum voi siivota. Estä toisto: connection timeout, `idle_in_transaction_session_timeout`.

## Taustaa

"Autovacuum ei toimi" on usein "joku pitää transaktiota auki". Tämä on yleisin bloat-juurisyy tuotannossa.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
