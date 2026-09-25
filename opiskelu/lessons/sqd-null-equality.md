# Kysely `SELECT * FROM users WHERE deleted_at = NULL` ei palauta yhtään riviä, vaikka poistamattomia käyttäjiä on tuhansia. Miksi?

## Tilanne

Uusi kehittäjä hakee aktiiviset käyttäjät:

```sql
SELECT * FROM users WHERE deleted_at = NULL;
```

Tulos on tyhjä, vaikka käyttäjiä on tuhansia ja lähes kaikilla `deleted_at` on tyhjä.

## Ratkaisu

NULLia testataan omilla operaattoreillaan:

```sql
SELECT * FROM users WHERE deleted_at IS NULL;      -- aktiiviset
SELECT * FROM users WHERE deleted_at IS NOT NULL;  -- poistetut
```

## Taustaa

NULL tarkoittaa SQL:ssä **tuntematonta arvoa**, ei "tyhjää". Minkä tahansa arvon vertailu NULLiin, myös `NULL = NULL`, on tulokseltaan NULL eikä TRUE. WHERE palauttaa vain rivit, joiden ehto on TRUE, joten `= NULL` ei palauta koskaan mitään.

Kun kahta saraketta verrataan ja kumpikin voi olla NULL, `a IS NOT DISTINCT FROM b` käsittelee kaksi NULLia samoina.

[Lue lisää](https://www.postgresql.org/docs/current/functions-comparison.html)
