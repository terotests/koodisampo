# Kuukausittainen myynti sarakkeina (tammi…joulu). PostgreSQL-työkalu?

## Tilanne

Myyntidata on normalisoitu riveinä:

```sql
-- sales(month, amount) — month 1..12
SELECT month, sum(amount) FROM sales WHERE year = 2024 GROUP BY month;
```

Johdonanto haluaa pivot-raportin: yksi rivi, sarakkeet tammi–joulu. Excelissä pivot on yksi klikkaus — SQL:ssä tarvitaan erillinen tekniikka.

Data näyttää tältä:

| month | amount |
|-------|--------|
| 1     | 12000  |
| 2     | 15000  |
| ...   | ...    |

Toivottu tulos:

| tammi | helmi | maalis | ... | joulu |
|-------|-------|--------|-----|-------|

## Ratkaisu

**Conditional aggregation tai `crosstab()` tablefunc-laajennuksessa:**

Portable ratkaisu (toimii ilman laajennuksia):

```sql
SELECT
  sum(CASE WHEN month = 1  THEN amount END) AS tammi,
  sum(CASE WHEN month = 2  THEN amount END) AS helmi,
  sum(CASE WHEN month = 3  THEN amount END) AS maalis,
  -- ...
  sum(CASE WHEN month = 12 THEN amount END) AS joulu
FROM sales
WHERE year = 2024;
```

PostgreSQL-vaihtoehto `FILTER`-lausekkeella:

```sql
sum(amount) FILTER (WHERE month = 1) AS tammi
```

Tai `crosstab()` laajennuksesta:

```sql
CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT * FROM crosstab(
  'SELECT year, month, sum(amount) FROM sales GROUP BY 1, 2 ORDER BY 1, 2',
  'SELECT generate_series(1, 12)'
) AS ct(year int, tammi numeric, helmi numeric, /* ... */ joulu numeric);
```

Conditional aggregation on portable; crosstab on PostgreSQL-työkalu dynaamisempiin pivot-tarpeisiin.

## Käytännössä

Kiinteälle 12 kuukauden pivotille conditional aggregation on yksinkertaisin ylläpitää. `crosstab` kannattaa, jos sarakemäärä vaihtelee (esim. tuotteet sarakkeina).

Testaa NULL-käsittely: kuukaudet ilman myyntiä näyttävät NULL — käytä `coalesce(..., 0)` raportissa tarvittaessa.

Dokumentoi pivot SQL-skriptissä; BI-työkalun visual pivot ei skaalaa 10M rivin batch-raporttiin.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
