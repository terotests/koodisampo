# Raportti tarvitsee samalle riville kaikkien tilausten määrän sekä avoimet ja peruutetut erikseen. Siistein PostgreSQL-tapa yhdellä kyselyllä?

## Tilanne

Johdon kojelautaan tarvitaan yksi rivi per päivä: kaikki tilaukset, avoimet ja peruutetut. Ensimmäinen versio teki kolme kyselyä ja yhdisti tulokset sovelluksessa.

## Ratkaisu

PostgreSQL:n **FILTER**-lauseke rajaa yksittäisen aggregaatin syötteen:

```sql
SELECT
  created_at::date AS day,
  COUNT(*)                                       AS total,
  COUNT(*) FILTER (WHERE status = 'open')        AS open,
  COUNT(*) FILTER (WHERE status = 'cancelled')   AS cancelled,
  SUM(total) FILTER (WHERE status <> 'cancelled') AS revenue
FROM orders
GROUP BY day
ORDER BY day;
```

## Taustaa

Taulu luetaan kerran, ja jokainen aggregaatti saa vain ne rivit, jotka täyttävät sen oman ehdon. Standardi-SQL:n vastine, joka toimii myös muissa tietokannoissa, on ehdollinen aggregaatti:

```sql
SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open
```

`WHERE` rajaisi koko kyselyn rivit (jolloin `total` ei enää olisi kaikki tilaukset), ja `GROUP BY status` tuottaisi oman rivin jokaiselle statukselle.

[Lue lisää](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES)
