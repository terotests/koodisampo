# Haku: `WHERE lower(email) = 'user@example.com'`. Tavallinen btree emailille ei käytössä. Ratkaisu?

## Tilanne

Case-insensitive kirjautuminen käyttää `lower(email)` vertailua. Indeksi `CREATE INDEX ON users (email)` ei aktivoidu — PostgreSQL ei "päätä" soveltaa funktiota automaattisesti indeksin hyväksi. Seq scan kaikilla käyttäjillä ei skaalaudu.

## Ratkaisu

```sql
CREATE INDEX ON users (lower(email));
```

**Expression index** vastaa täsmälleen WHERE-lausekkeen muotoa. Vaihtoehto: generated column `email_lower` + indeksi siihen — helpottaa ORM:ää, jos funktioindeksi on hankala.

Varmista sovelluksen ja indeksin yhteensopivuus: sama normalisointi (lower vs citext-laajennus on erillinen ratkaisu).

## Taustaa

citext-tyyppi + btree on vaihtoehto case-insensitive haulle ilman expression indexiä. Expression index on kevyempi, jos et halua laajennusta.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-expressional.html)
