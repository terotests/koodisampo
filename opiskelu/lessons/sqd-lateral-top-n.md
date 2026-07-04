# Kolme viimeisintä tilausta per asiakas ilman window-funktiota. PostgreSQL-malli?

## Tilanne

Asiakaspalvelun näkymä näyttää jokaiselle asiakkaalle kolme viimeisintä tilausta. Perinteinen correlated subquery toistuu jokaiselle asiakasriville:

```sql
SELECT c.id, c.name,
       (SELECT o.order_id FROM orders o
        WHERE o.customer_id = c.id
        ORDER BY o.created_at DESC LIMIT 3) -- ei toimi suoraan: palauttaa yhden arvon
FROM customers c;
```

Ikkunafunktio (`ROW_NUMBER()`) on yleinen ratkaisu, mutta kysymys pyytää mallia ilman window-funktiota. PostgreSQL tarjoaa LATERAL-liitoksen correlated top-N -kuvioon.

## Ratkaisu

**LATERAL-alikysely — correlated top-N per parent:**

```sql
SELECT c.id, c.name, recent.order_id, recent.total, recent.created_at
FROM customers c
CROSS JOIN LATERAL (
  SELECT o.order_id, o.total, o.created_at
  FROM orders o
  WHERE o.customer_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 3
) recent;
```

LATERAL mahdollistaa sen, että oikean puolen alikysely viittaa vasemman puolen `c.id`:hen. `LIMIT 3` per asiakas — tehokas indeksillä `(customer_id, created_at DESC)`.

LATERAL mahdollistaa correlated top-N per parent ilman window-funktiota.

## Käytännössä

Indeksi `(customer_id, created_at DESC)` on kriittinen — ilman sitä LATERAL ajaa nested loop + sort jokaiselle asiakkaalle.

Jos asiakkaita on paljon mutta tarvitset vain osan, suodata `customers` ensin (`WHERE c.active = true`).

Vertaa suorituskykyä window-funktioon (`ROW_NUMBER() ... WHERE rn <= 3`) EXPLAIN ANALYZE:lla — PostgreSQL 11+ optimoi molempia usein samankaltaisesti, mutta LATERAL on eksplisiittisempi "top-N per group" -ilmaus.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
