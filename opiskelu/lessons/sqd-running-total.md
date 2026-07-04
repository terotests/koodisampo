# Kumulatiivinen summa päivittäin ilman correlated subquerya. Ratkaisu?

## Tilanne

Päivittäiset myyntitotalit listassa — haluat jokaiselle päivälle myös **kumulatiivisen summan** vuoden alusta tai ajanjakson alusta. Correlated subquery `(SELECT SUM(...) FROM t t2 WHERE t2.day <= t.day)` toimii mutta on O(n²) ja hidas.

## Ratkaisu

**Running total** ikkunafunktiolla:

```sql
SELECT
  day,
  amount,
  SUM(amount) OVER (
    ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM daily_sales;
```

`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` sisältää kaikki aiemmat rivit nykyiseen asti. Vaihtoehto lyhyempään: `SUM(amount) OVER (ORDER BY day)` — oletusframe riippuu ORDER BY:stä (RANGE vs ROWS — dokumentoi tarkasti).

## Taustaa

Running sum, running count ja running average ovat ikkunafunktioiden peruskäyttöä. FRAME-määrittely kontrolloi tarkasti, mitkä rivit sisällytetään.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
