# Seuraavan tilauksen päivämäärä samalla rivillä nykyisen kanssa. Funktio?

## Tilanne

Asiakasanalyysissä jokaisella tilausrivillä haluat nähdä: milloin seuraava tilaus tulee samalta asiakkaalta? Aika seuraavaan tilaukseen auttaa churn-analyysissä ja retention-mittareissa.

Self-join `(o1 JOIN o2 ON o1.customer_id = o2.customer_id AND o2.date > o1.date)` on mahdollinen mutta monimutkainen ja hidas.

## Ratkaisu

**LEAD**-ikkunafunktio:

```sql
SELECT
  order_id,
  customer_id,
  order_date,
  LEAD(order_date) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS next_order_date
FROM orders;
```

`LEAD(order_date)` palauttaa seuraavan rivin päivämäärän samassa partitionissa. Viimeisellä tilauksella arvo on NULL.

Erot seuraavaan tilaukseen: `LEAD(order_date) - order_date`.

## Taustaa

LEAD on LAG:n peilikuva — katsoo eteenpäin ikkunassa. PARTITION BY erottaa asiakkaat toisistaan.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
