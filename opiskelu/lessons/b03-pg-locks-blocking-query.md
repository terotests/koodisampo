# UPDATE jää odottamaan — pg_stat_activity näyttää wait_event lock. Ensimmäinen diagnostiikka?

## Tilanne

Sovellus raportoi, että UPDATE "jää jumiin". `pg_stat_activity` näyttää istunnon tilassa `active` ja `wait_event_type = Lock` — jokin toinen istunto pitää ristiriitaista lukkoa. Indeksin puute ei selitä tätä — kyse on lukitusketjusta.

Tarvitset nopeasti vastauksen: **kuka estää** ja **mikä lukko**.

## Ratkaisu

Yhdistä **`pg_locks`** ja **`pg_blocking_pids()`**:

```sql
SELECT
  a.pid,
  a.usename,
  a.query,
  pg_blocking_pids(a.pid) AS blocked_by
FROM pg_stat_activity a
WHERE cardinality(pg_blocking_pids(a.pid)) > 0;
```

Tai tarkempi lukkoanalyysi:

```sql
SELECT l.locktype, l.mode, l.granted, a.query, a.pid
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;
```

Näet estäjän PID:n → etsi sen kysely `pg_stat_activity`:sta. Ratkaisu voi olla commit/rollback pitkässä transaktiossa, indeksin puute (lock upgrade), tai DDL lukko.

## Taustaa

Tämä kysymys on pg-indexes-luvussa, koska puuttuva indeksi voi aiheuttaa pitkiä table lock -ketjuja — mutta diagnostiikka alkaa aina lukitusketjusta, ei indeksin arvaamisesta.

[Lue lisää](https://www.postgresql.org/docs/current/view-pg-locks.html)
