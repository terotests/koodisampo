# Autovacuum ei siivoa dead tupleja — pg_stat_activity näyttää 'idle in transaction'. Syy?

## Tilanne

Dead tuple -määrä kasvaa, `last_autovacuum` ei päivity odotetusti. Samalla `pg_stat_activity` näyttää istunnon `idle in transaction` — transaktio avattu, mutta ei commitoitu eikä rollbackattu (esim. unohdettu psql-istunto, connection pool bug).

## Ratkaisu

**Pitkä transaktio pitää xmin:ää** — vacuum ei voi poistaa riviversioita, jotka ovat edelleen näkyvissä transaktiolle. Korjaa:

```sql
SELECT pg_terminate_backend(pid)  -- harkiten
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND xact_start < now() - interval '1 hour';
```

Ennaltaehkäisy: `idle_in_transaction_session_timeout`, monitoring hälytykset.

## Taustaa

MVCC-sääntö: mikään transaktio ei saa kadottaa näkyvyyttään. Yksi avoin transaktio voi bloatata koko klusterin.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
