# Raportti näyttää kuukausimyynnin ja edellisen kuun eron samalla rivillä. Mikä auttaa?

## Tilanne

Myyntiraportissa jokaisella rivillä: `month`, `revenue`, ja haluat `revenue - previous_revenue` (month-over-month muutos). Correlated subquery edelliseen kuukauteen on mahdollinen mutta raskas ja vaikea ylläpitää.

Tarvitset edellisen rivin arvon samassa järjestyksessä.

## Ratkaisu

**LAG**-ikkunafunktio:

```sql
SELECT
  month,
  revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) AS mom_change
FROM monthly_sales;
```

`LAG(revenue)` palauttaa edellisen rivin `revenue`-arvon `ORDER BY month` -järjestyksessä. Ensimmäisellä rivillä LAG on NULL — käsittele `COALESCE` tai jätä tyhjäksi.

`LAG(revenue, 2)` vertaa kahta kuukautta taaksepäin. `PARTITION BY region` erottelee alueet.

## Taustaa

LAG ja LEAD ovat standardi tapa aikasarja-vertailuihin SQL:ssä. PostgreSQL tukee niitä täysin ANSI SQL -yhteensopivasti.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
