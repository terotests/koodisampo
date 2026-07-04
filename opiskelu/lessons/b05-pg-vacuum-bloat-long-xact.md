# Autovacuum ei vapauta tilaa — pg_stat_activity näyttää 8h vanhan avoimen transaktion. Syy?

## Tilanne

Taulu paisuu, autovacuum lokittaa ajoja, mutta `n_dead_tup` ei putoa merkittävästi. `pg_stat_activity`: 8 tunnin vanha `idle in transaction` — esim. analytiikkatyökalu jätti transaktion auki.

## Ratkaisu

**Pitkä avoin transaktio estää dead tuple -siivouksen.** VACUUM ei voi poistaa rivejä, jotka transaktio "näkee". Ratkaise transaktio (commit/rollback/terminate) → autovacuum voi siivota seuraavalla kierroksella.

```sql
SELECT pid, xact_start, query FROM pg_stat_activity
WHERE state = 'idle in transaction';
```

## Taustaa

8h on extreme — mutta 15 min riittää bloatiin aktiivisessa UPDATE-kuormassa. Monitoroi `max(xact_duration)`.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
