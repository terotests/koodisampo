# Jokaiselle tilausriville tarvitset saman asiakkaan ensimmäisen tilauksen päivämäärän ilman GROUP BY:tä. Mikä toimii?

## Tilanne

Raportti listaa jokaisen tilauksen rivin: `order_id`, `amount`, `order_date` — ja lisäksi saman asiakkaan ensimmäisen tilauksen päivämäärän, jotta näet esimerkiksi, kuinka kauan asiakas on ollut mukana. `GROUP BY` ei sovi, koska haluat yksittäiset tilausrivit, ei aggregaattia per asiakas.

Correlated subquery toimii, mutta on hidas ja vaikea lukea.

## Ratkaisu

**FIRST_VALUE** ikkunafunktiona:

```sql
SELECT
  order_id,
  amount,
  order_date,
  FIRST_VALUE(order_date) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS first_order_date
FROM orders;
```

`PARTITION BY customer_id` rajaa ikkunan saman asiakkaan tilauksiin. `ORDER BY` määrittää, mikä rivi on "first" — tässä aikaisin `order_date`.

Tähän tapaukseen käy myös `MIN(order_date) OVER (PARTITION BY customer_id)`. FIRST_VALUE on hyödyllisempi, kun haluat ensimmäisen rivin jonkin *muun* sarakkeen arvon, esimerkiksi ensimmäisen tilauksen summan.

## Taustaa

Ikkunafunktiot säilyttävät yksittäiset rivit toisin kuin GROUP BY. FIRST_VALUE, LAST_VALUE ja NTH_VALUE kuuluvat samaan perheeseen.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
