# Jokaiselle tilaukselle tarvitset asiakkaan nimen ilman GROUP BY:ä. Mikä toimii?

## Tilanne

Raportti listaa jokaisen tilauksen rivin: `order_id`, `amount`, `customer_name`. Asiakkaan nimi tulee joinista — mutta `GROUP BY` ei sovi, koska haluat yksittäiset tilausrivit, ei aggregaattia per asiakas.

Correlated subquery toimii, mutta on hidas ja vaikea lukea.

## Ratkaisu

**FIRST_VALUE** ikkunafunktiona:

```sql
SELECT
  order_id,
  amount,
  FIRST_VALUE(customer_name) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS customer_name
FROM orders o
JOIN customers c ON c.id = o.customer_id;
```

`PARTITION BY customer_id` rajaa ikkunan saman asiakkaan tilauksiin. `ORDER BY` määrittää, mikä rivi on "first" — tyypillisesti `order_date` tai `created_at`.

Vaihtoehto yksinkertaisempaan tapaukseen: tavallinen JOIN riittää, jos jokaisella tilauksella on yksi asiakas.

## Taustaa

Ikkunafunktiot säilyttävät yksittäiset rivit toisin kuin GROUP BY. FIRST_VALUE, LAST_VALUE ja NTH_VALUE kuuluvat samaan perheeseen.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
