# Sisäkkäinen subquery 5 tasoa syvänä. Refaktorointi luettavuuteen?

## Tilanne

Legacy-raportti on kasvanut vuosien varrella. Jokainen uusi vaatimus on lisätty uutena sisäkkäisenä alikyselynä:

```sql
SELECT *
FROM (
  SELECT customer_id, total FROM (
    SELECT ... FROM (
      SELECT ... FROM (
        SELECT ... FROM orders WHERE status = 'shipped'
      ) a WHERE ...
    ) b WHERE ...
  ) c WHERE ...
) d WHERE total > 1000;
```

Viisi tasoa, nimettömät aliaset (`a`, `b`, `c`), ei kommentteja. Uusi kehittäjä yrittää lisätä suodattimen ja rikkoo sulkeet. `EXPLAIN` on mahdoton lukea, koska jokainen taso on piilotettu.

## Ratkaisu

**`WITH`-vaiheet — jokainen logiikkakerros omaan nimettyyn CTE:hen:**

```sql
WITH shipped_orders AS (
  SELECT customer_id, total, created_at
  FROM orders
  WHERE status = 'shipped'
),
recent AS (
  SELECT customer_id, total
  FROM shipped_orders
  WHERE created_at >= CURRENT_DATE - interval '90 days'
),
customer_totals AS (
  SELECT customer_id, sum(total) AS total
  FROM recent
  GROUP BY customer_id
)
SELECT customer_id, total
FROM customer_totals
WHERE total > 1000;
```

CTE jakaa monimutkaisen kyselyn vaiheisiin — maintainability on tavoite, ei automaattinen suorituskykyparannus. Jokainen vaihe on nimetty, testattavissa ja poistettavissa tarvittaessa.

## Käytännössä

Refaktoroi yksi taso kerrallaan: pura sisin subquery CTE:ksi, aja testit, toista. Älä kirjoita koko kyselyä uudelleen yhdessä PR:ssä.

PostgreSQL 12+ inlineaa CTE:t — jos sama CTE viitataan useasti, harkitse `AS MATERIALIZED` toistuvien skannausten välttämiseksi.

Aseta tiimille soft limit: yli kaksi sisäkkäistä subquery-tasoa → pakollinen CTE-refaktorointi code reviewssa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
