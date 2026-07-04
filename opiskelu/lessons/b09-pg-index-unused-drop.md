# pg_stat_user_indexes näyttää idx_reports_date never used — mutta INSERT hidastuu. Toimenpide?

## Tilanne

Raportti-indeksi `idx_reports_date` luotiin vuosi sitten "tulevia raportteja varten". `pg_stat_user_indexes.idx_scan = 0`, mutta jokainen INSERT reports-tauluun päivittää indeksin. Kirjoituslatenssi on noussut — indeksi maksaa ylläpidon ilman hyötyä.

## Ratkaisu

**Arvioi poisto** — unused index hidastaa kirjoituksia turhaan:

```sql
-- Varmista: ei pg_stat_statements-kyselyitä, ei BI-raportteja
DROP INDEX CONCURRENTLY idx_reports_date;
```

Ennen poistoa: tarkista `pg_stat_user_indexes`, `pg_stat_statements` (query pattern), ja dokumentoi päätös. Jos indeksi tarvitaan harvoin (kuukausiraportti), harkitse materialized view tai erillinen analytics-kanta.

## Taustaa

"Never used" tarkoittaa `idx_scan = 0` instanssin stats-elinajan aikana (tai resetin jälkeen). Indeksi on write-kustannus jokaisessa DML:ssä — dead index on yleinen tuotanto-ongelma.

[Lue lisää](https://www.postgresql.org/docs/current/monitoring-stats.html)
