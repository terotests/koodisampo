# pg_stat_activity näyttää 12 h avoimen read transactionin — dead tuples kasaantuvat. Syy?

## Tilanne

12 tunnin `idle in transaction` — read-only transaktio analytics-työkalusta. Samaan aikaan `n_dead_tup` kasvaa, autovacuum ei siivoa tehokkaasti. Read-only luulee olevansa "turvallinen", mutta pitää xmin:ää.

## Ratkaisu

**Tunnista ja päätä pitkä transaktio** — vacuum ei voi siivota tarvittavaa:

```sql
SELECT pid, xact_start, state, query
FROM pg_stat_activity
WHERE xact_start < now() - interval '1 hour';
-- COMMIT/ROLLBACK tai pg_terminate_backend
```

Read-only transaction estää dead tuple -poiston yhtä tehokkaasti kuin write-transaktio. Aseta `idle_in_transaction_session_timeout`.

## Taustaa

12h on extreme esimerkki — 5 min riittää ongelmaan aktiivisessa UPDATE-kuormassa. BI-työkalujen default "keep connection open" on yleinen juurisyy.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
