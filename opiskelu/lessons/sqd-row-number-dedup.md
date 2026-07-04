# Tarvitset viimeisimmän tilauksen per asiakas. Mikä ikkunafunktio?

## Tilanne

Taulussa useita tilauksia per asiakas. Raportti tarvitsee vain **viimeisimmän** tilauksen kullekin `customer_id`:lle — deduplikointi "keep latest row per group".

`GROUP BY customer_id` + `MAX(created_at)` vaatii joinin takaisin täyteen riviin. Correlated subquery on hidas.

## Ratkaisu

**ROW_NUMBER()** partitionilla:

```sql
SELECT *
FROM (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY created_at DESC
         ) AS rn
  FROM orders
) t
WHERE rn = 1;
```

`ROW_NUMBER` antaa uniikin numeron 1, 2, 3... per partition. `rn = 1` = viimeisin `created_at DESC` -järjestyksessä.

PostgreSQL 13+: **`DISTINCT ON (customer_id)`** on vaihtoehto lyhyempään syntaksiin.

## Taustaa

"Latest row per group" on yksi yleisimmistä ikkunafunktio- käyttötapauksista. ROW_NUMBER vs RANK: ROW_NUMBER erottaa tasat deterministisesti (lisää tie-breaker ORDER BY:hen).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
