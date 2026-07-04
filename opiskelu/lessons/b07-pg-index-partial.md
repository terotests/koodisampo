# Indeksi on iso mutta 80 % riveistä on deleted_at IS NOT NULL. Tehokkaampi indeksi?

## Tilanne

Soft-delete-malli: `deleted_at IS NULL` tarkoittaa aktiivista riviä. Täysi indeksi `(user_id, created_at)` sisältää myös poistetut rivit — 80 % indeksin lehdistä on turhaa. INSERT/UPDATE hidastuu ja indeksi vie levytilaa.

Kyselyt suodattavat lähes aina `WHERE deleted_at IS NULL`.

## Ratkaisu

```sql
CREATE INDEX ON orders (user_id, created_at)
WHERE deleted_at IS NULL;
```

**Partial index** indeksoi vain aktiiviset rivit. Indeksi on ~5× pienempi tässä skenaariossa, ylläpito kevyempi, cache tehokkaampi.

WHERE-ehdon on oltava yhteensopiva kyselyiden kanssa — planner käyttää indeksiä vain, kun kysely implikoi saman rajauksen.

## Taustaa

Soft-delete + partial index on yleinen PostgreSQL-pattern. Vältä indeksoimasta sarakkeita, joita haetaan vain poistetuille riveille erillisellä admin-kyselyllä.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-partial.html)
