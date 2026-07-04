# Kysely `WHERE lower(email) = 'foo@bar.com'` — indeksi email-sarakkeella ei käytössä. Ratkaisu?

## Tilanne

Kirjautumishaku normalisoi sähköpostin: `WHERE lower(email) = 'foo@bar.com'`. Indeksi `(email)` on olemassa, mutta `EXPLAIN` näyttää seq scanin — btree-indeksi `email`-sarakkeella ei vastaa funktiokutsua WHERE:ssä.

PostgreSQL voi käyttää indeksiä vain, kun WHERE vastaa indeksin lauseketta tai operaattoriluokkaa.

## Ratkaisu

**Expression index** funktiolla, jota kysely käyttää:

```sql
CREATE INDEX ON users (lower(email));
```

Nyt planner voi tehdä Index Scan, kun WHERE on identtisessä muodossa `lower(email) = constant`. Varmista, että sovellus ei käytä eri funktiota (esim. `LOWER` vs `lower` — PostgreSQL normalisoi, mutta `trim(lower(email))` vaatii oman indeksin).

## Taustaa

Expression index toimii myös `date_trunc`, cast-operaatioille ja computed-kentille. Huomioi, että indeksi hidastaa INSERT/UPDATE:ia expression-sarakkeeseen liittyen.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-expressional.html)
