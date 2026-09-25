# Kysely `WHERE customer_id NOT IN (SELECT customer_id FROM blacklist)` palauttaa yhtäkkiä nolla riviä. Blacklist-tauluun lisättiin rivi, jossa customer_id on NULL. Miksi?

## Tilanne

Markkinointiraportti hakee asiakkaat, jotka eivät ole estolistalla:

```sql
SELECT c.id, c.email
FROM customers c
WHERE c.id NOT IN (SELECT customer_id FROM blacklist);
```

Kysely toimi vuosia. Sitten joku lisäsi estolistalle rivin, jonka `customer_id` on NULL (esim. poistetun asiakkaan jäänne), ja raportti tyhjeni kokonaan.

## Ratkaisu

Käytä **NOT EXISTS** -muotoa, joka ei kärsi NULL-arvoista:

```sql
SELECT c.id, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM blacklist b WHERE b.customer_id = c.id
);
```

Jos NOT IN on pakko säilyttää, suodata NULLit alikyselystä (`WHERE customer_id IS NOT NULL`), ja harkitse `NOT NULL` -rajoitetta sarakkeelle.

## Taustaa

`x NOT IN (a, b, NULL)` tarkoittaa `x <> a AND x <> b AND x <> NULL`. Viimeinen vertailu on SQL:n kolmiarvoisessa logiikassa **tuntematon** (NULL), joten koko ehto on joko FALSE tai NULL, ei koskaan TRUE. WHERE hyväksyy vain TRUE-rivit, joten tulos on tyhjä.

NOT EXISTS kysyy "löytyykö vastaavaa riviä", ja NULL-rivi ei koskaan vastaa `=`-ehtoa, joten se ei vaikuta tulokseen. PostgreSQL osaa lisäksi toteuttaa NOT EXISTS -muodon tehokkaana anti-joinina.

[Lue lisää](https://www.postgresql.org/docs/current/functions-subquery.html#FUNCTIONS-SUBQUERY-NOTIN)
