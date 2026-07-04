# Bulk INSERT 10M riviä yöajossa — aamulla queryt hitaita. Mitä aamulla?

## Tilanne

Yöllinen ETL lisäsi 10M riviä. Aamulla raportit ovat hitaita — planner arvioi vanhat rivimäärät, valitsee huonot suunnitelmat. Bulk INSERT ei päivitä tilastoja automaattisesti ennen autovacuum analyze -ajoa.

## Ratkaisu

Aamulla (tai mieluummin heti loadin jälkeen):

```sql
ANALYZE loaded_table;
-- tai
VACUUM ANALYZE loaded_table;
```

**ANALYZE** on kriittisin — planner tarvitsee uudet stats. VACUUM siivoaa mahdolliset dead tuplet load-prosessista. Lisää ANALYZE ETL-skriptin loppuun automaattisesti.

## Taustaa

"Hitaita aamulla bulk loadin jälkeen" on klassinen ANALYZE-puute — ei välttämättä bloat. Erottele stats vs bloat diagnostiikassa.

[Lue lisää](https://www.postgresql.org/docs/current/sql-analyze.html)
