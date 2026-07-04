# PostgreSQL 12+: CTE viitataan kerran, mutta planner yhdistää sen pääkyselyyn hitaasti. Vaihtoehto?

## Tilanne

PostgreSQL 12:een asti CTE (`WITH`) toimi implisiittisesti optimointiesteenä — se materialisoitiin aina. PG 12+ muutti oletuksen: planner voi **inlineata** CTE:n pääkyselyyn (CTE scan), mikä nopeuttaa monia kyselyitä. Joskus inlining tuottaa huonon suunnitelman: CTE on monimutkainen ja planner yhdistää sen pääkyselyyn tavalla, joka toistaa työtä tai valitsee väärän join-järjestyksen.

## Ratkaisu

Pakota materialisointi **`MATERIALIZED`**-vihjeellä:

```sql
WITH big AS MATERIALIZED (
  SELECT ... FROM huge_table WHERE ...
)
SELECT * FROM big JOIN other ON ...;
```

`AS MATERIALIZED` pakottaa CTE:n laskennan kerran ja tallentaa tuloksen väliaikaiseen relationiin — kuten vanha PG-käyttäytyminen. Vastakohta: `AS NOT MATERIALIZED` pakottaa inliningin, kun haluat varmistaa yhdistämisen.

Valitse MATERIALIZED, kun CTE on raskas ja viitataan kerran — inlining hidastaa.

## Taustaa

Vertaa `EXPLAIN (ANALYZE, BUFFERS)` molemmilla tavoilla. CTE-vihjeet ovat PostgreSQL 12+ -ominaisuus — dokumentoi valinta tiimin SQL-tyyliohjeisiin.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
