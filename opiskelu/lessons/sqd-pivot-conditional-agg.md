# Myynti riveinä (product, Q1, Q2, Q3). Ilman crosstab-laajennusta?

## Tilanne

Myyntidata on normalisoitu riveinä: `(product, quarter, amount)`. Raportti tarvitsee sarakkeet: `product | q1 | q2 | q3`. Excel-pivot on helppo — SQL:ssä tarvitaan pivot-logiikka.

PostgreSQLin `tablefunc` crosstab-laajennus on vaihtoehto, mutta kysymys kysyy ratkaisua ilman sitä.

## Ratkaisu

**Conditional aggregation** CASE-lausekkeilla:

```sql
SELECT
  product,
  SUM(CASE WHEN quarter = 1 THEN amount END) AS q1,
  SUM(CASE WHEN quarter = 2 THEN amount END) AS q2,
  SUM(CASE WHEN quarter = 3 THEN amount END) AS q3
FROM sales
GROUP BY product;
```

`SUM(CASE WHEN ... THEN amount END)` on standardi SQL-pivot ilman laajennuksia. `FILTER (WHERE quarter = 1)` on PostgreSQL-vaihtoehto samalle:

```sql
SUM(amount) FILTER (WHERE quarter = 1) AS q1
```

## Taustaa

Pivot vaatii GROUP BY pivot-sarakkeen (product) yli. Dynaaminen pivot (muuttuva sarakemäärä) vaatii crosstab, PL/pgSQL tai sovelluskerroksen.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
