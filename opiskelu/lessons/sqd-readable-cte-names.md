# Monivaiheinen raportti on vaikea lukea sisäkkäisillä alikyselyillä. Mitä kokeilet ensin?

## Tilanne

Kuukausiraportti laskee ensin viime kuun tilaukset, sitten aluekohtaiset summat, sitten top-asiakkaat per alue ja lopuksi yhdistää tulokset yhdeksi SELECT:ksi. Kehittäjä on pinonnut viisi sisäkkäistä alikyselyä:

```sql
SELECT region, customer_id, total
FROM (
  SELECT ...
  FROM (
    SELECT ...
    FROM (
      SELECT ... FROM orders WHERE ...
    ) x
  ) y
) z
WHERE ...
```

Kukaan tiimissä ei uskalla muokata kyselyä — väärä sulku rikkoo koko ketjun. Testaus vaatii kopioimista ja erillisten alikyselyjen ajamista manuaalisesti.

## Ratkaisu

**Nimetty CTE (`WITH`) — jokainen logiikkakerros omaan vaiheeseen:**

```sql
WITH recent_orders AS (
  SELECT customer_id, total, created_at
  FROM orders
  WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
    AND created_at < date_trunc('month', CURRENT_DATE)
),
region_totals AS (
  SELECT c.region, sum(o.total) AS region_total
  FROM recent_orders o
  JOIN customers c ON c.id = o.customer_id
  GROUP BY c.region
),
top_customers AS (
  SELECT c.region, o.customer_id, sum(o.total) AS total,
         row_number() OVER (PARTITION BY c.region ORDER BY sum(o.total) DESC) AS rn
  FROM recent_orders o
  JOIN customers c ON c.id = o.customer_id
  GROUP BY c.region, o.customer_id
)
SELECT region, customer_id, total
FROM top_customers
WHERE rn <= 5;
```

Nimetty CTE parantaa luettavuutta — kirjan ydinajatus monimutkaisiin raportteihin. Jokainen vaihe on nimetty, testattavissa erikseen (`SELECT * FROM recent_orders LIMIT 10`) ja dokumentoitu nimellään.

## Käytännössä

CTE-nimet ov dokumentaatiota: `recent_orders`, `region_totals` kertovat lukijalle mitä kukin vaihe tekee. Vältä geneerisiä nimiä (`t1`, `subq`).

PostgreSQL 12+ inlineaa CTE:t oletuksena — jos tarvitset materialisoinnin (esim. toistuva viittaus), käytä `AS MATERIALIZED`. `EXPLAIN`-tuloste kertoo, materialisoituiko vaihe.

Refaktoroi sisäkkäiset alikyselyt CTE:ksi ennen kuin lisäät uutta logiikkaa — tekninen velka kasvaa eksponentiaalisesti syvyyden kanssa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
