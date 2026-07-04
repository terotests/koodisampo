# Bulk load jälkeen planner valitsee huonon suunnitelman — stats vanhentuneet. Toimenpide?

## Tilanne

Yöllinen bulk INSERT muutti taulun koon 100k → 10M riviin. Aamulla kyselyt käyttävät seq scania tai väärää joinia — `pg_stats` näyttää vanhat rivimäärät. Planner optimoi vanhan datan mukaan.

Autovacuum ANALYZE voi ajaa myöhemmin — liian myöhään aamun ruuhkalle.

## Ratkaisu

```sql
ANALYZE loaded_table;
-- tai kattavammin:
VACUUM ANALYZE loaded_table;
```

**ANALYZE** päivittää planner-tilastot. **VACUUM ANALYZE** siivoaa dead tuplet (jos loadissa oli UPDATE) ja analysoi. Bulk load -prosessiin kuuluu ANALYZE loadin jälkeen — älä odota autovacuumia kriittisissä tauluissa.

## Taustaa

Stats vs bloat: ANALYZE korjaa suunnitelmat; VACUUM korjaa dead tuplet. Bulk loadin jälkeen tarvitaan usein molemmat.

[Lue lisää](https://www.postgresql.org/docs/current/sql-analyze.html)
