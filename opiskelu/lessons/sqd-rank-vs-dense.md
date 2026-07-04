# Top 3 myyjää; tasapisteet eivät saa hypätä sijaa 4:stä 6:een. Funktio?

## Tilanne

Myyntikilpailussa kaksi myyjää jakaa sijan 2 — RANK() antaa seuraavalle sijalle 4 (ohittaa 3). Raportti haluaa top 3 *sijaa* mukaan lukien tasat — eli sijat 1, 2, 2, 3 (ei 1, 2, 2, 4).

RANK vs DENSE_RANK -ero on yleinen raportointivirhe.

## Ratkaisu

**DENSE_RANK()** — tasatilanteessa seuraava sija ei hyppää:

```sql
SELECT salesperson, sales,
       DENSE_RANK() OVER (ORDER BY sales DESC) AS rank
FROM sales_by_person
QUALIFY rank <= 3;  -- PostgreSQL: käytä alikyselyä
```

PostgreSQLissä suodata alikyselyllä:

```sql
SELECT * FROM (
  SELECT *, DENSE_RANK() OVER (ORDER BY sales DESC) AS r
  FROM sales_by_person
) t WHERE r <= 3;
```

RANK: 1, 2, 2, **4**, 5 — DENSE_RANK: 1, 2, 2, **3**, 4.

## Taustaa

ROW_NUMBER antaa aina uniikit sijat (tie-breaker ORDER BY:ssä). DENSE_RANK sopii "top N sijaa" -raportteihin tasatilanteiden kanssa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
