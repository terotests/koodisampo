# Päivitykset ovat runsaita, taulu kasvaa mutta rivimäärä pysyy. Epäily?

## Tilanne

Tuotantotaulussa INSERT/UPDATE-tahti korkea, mutta `COUNT(*)` pysyy samana. Levykäyttö kasvaa kuukausittain — klassinen oire, jota uusi DBA:n pitää tunnistaa ennen indeksien lisäämistä.

## Ratkaisu

**Dead tuple -bloat** — tarkista:

```sql
SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum
FROM pg_stat_user_tables
WHERE relname = 'your_table';
```

Autovacuum siivoaa dead tuplet (merkitsee tilan vapaaksi). Jos `n_dead_tup` kasvaa jatkuvasti: autovacuum-asetukset, pitkät transaktiot. Levytilan palautus OS:lle vaatii VACUUM FULL / pg_repack.

## Taustaa

Ensimmäinen epäily bloatissa — ei "tarvita enemmän RAM" tai "indeksi rikki". MVCC on syy.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
