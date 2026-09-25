# Kaksi rinnakkaista siirtoa: toinen päivittää tilit A→B, toinen B→A. Lokissa näkyy satunnaisesti 'deadlock detected'. Miten estät?

## Tilanne

Tilisiirto tehdään transaktiossa:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = :from;
UPDATE accounts SET balance = balance + 100 WHERE id = :to;
COMMIT;
```

Kun siirto A→B ja siirto B→A osuvat samaan aikaan, PostgreSQL keskeyttää toisen virheellä `deadlock detected`.

## Ratkaisu

Lukitse rivit **aina samassa järjestyksessä**, esimerkiksi pienin id ensin:

```sql
BEGIN;
SELECT id FROM accounts
WHERE id IN (:from, :to)
ORDER BY id
FOR UPDATE;

UPDATE accounts SET balance = balance - 100 WHERE id = :from;
UPDATE accounts SET balance = balance + 100 WHERE id = :to;
COMMIT;
```

Varaudu silti virheeseen: sovellus yrittää keskeytetyn transaktion uudelleen (SQLSTATE `40P01`).

## Taustaa

Deadlock syntyy, kun transaktio 1 pitää lukkoa A ja odottaa B:tä, ja transaktio 2 pitää B:tä ja odottaa A:ta. PostgreSQL havaitsee kehän `deadlock_timeout`-ajan jälkeen ja keskeyttää toisen. Kun kaikki lukitsevat samassa järjestyksessä, kehää ei voi syntyä.

`deadlock_timeout`-arvon nostaminen vain viivästää tunnistusta. Autocommit-lauseet poistaisivat lukkiutumisen, mutta rikkoisivat siirron: raha voisi kadota, jos toinen päivitys epäonnistuu.

[Lue lisää](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-DEADLOCKS)
