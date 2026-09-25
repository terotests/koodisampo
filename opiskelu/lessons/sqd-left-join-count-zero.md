# Raportti: tilausten määrä per asiakas, myös nollat. `LEFT JOIN orders o ... GROUP BY c.id` ja `COUNT(*)` näyttää tilauksettomille asiakkaille luvun 1. Korjaus?

## Tilanne

Myynti haluaa listan kaikista asiakkaista ja heidän tilaustensa määrästä, myös niistä, jotka eivät ole tilanneet mitään:

```sql
SELECT c.id, c.name, COUNT(*) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
```

Tilauksettomien asiakkaiden kohdalla luku on 1 eikä 0.

## Ratkaisu

Laske sarake oikeanpuoleisesta taulusta, ei rivejä:

```sql
SELECT c.id, c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
```

## Taustaa

LEFT JOIN tuottaa asiakkaalle, jolla ei ole tilauksia, **yhden rivin**, jossa kaikki `orders`-sarakkeet ovat NULL. `COUNT(*)` laskee rivit, joten tulos on 1. `COUNT(sarake)` laskee vain ne rivit, joissa sarake ei ole NULL, joten tulos on 0.

Sama koskee muita aggregaatteja: `SUM(o.total)` palauttaa tilauksettomalle NULLin, joten raportissa kannattaa käyttää `COALESCE(SUM(o.total), 0)`.

[Lue lisää](https://www.postgresql.org/docs/current/functions-aggregate.html)
