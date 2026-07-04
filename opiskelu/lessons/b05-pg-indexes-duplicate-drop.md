# Kaksi identtistä btree-indeksiä samoille sarakkeille — kirjoitus hidasta. Toimenpide?

## Tilanne

Code review paljastaa:

```sql
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_email_v2 ON users (email);  -- identtinen
```

Molemmat indeksit päivitetään jokaisessa INSERT/UPDATE:ssa, joka koskee `email`-saraketta — tuplaturha työ. `pg_stat_user_indexes` voi näyttää toisen indeksin harvoin käytetyksi, jos planner valitsee aina toisen.

## Ratkaisu

**Poista toinen duplikaatti:**

```sql
DROP INDEX CONCURRENTLY idx_users_email_v2;
```

Säilytä indeksi, jolla on selkeä nimi, enemmän `idx_scan`-käyttöä, tai jota dokumentaatio viittaa. Duplikaatti ei paranna lukunopeutta — planner käyttää yhtä indeksiä kerrallaan.

Ennaltaehkäisy: `pg_indexes`-kysely deployn yhteydessä — etsi samat `(tablename, indexdef)`-yhdistelmät.

## Taustaa

Jokainen ylimääräinen indeksi hidastaa kirjoituksia ja vie levytilaa. Indeksien "varmuuskopiointi" duplikaattina on anti-pattern.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-intro.html)
