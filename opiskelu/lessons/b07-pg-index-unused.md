# Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan=0 usealle indeksille. Toimenpide?

## Tilanne

INSERT/UPDATE on hidastunut. `pg_stat_user_indexes` paljastaa useita indeksejä, joilla `idx_scan = 0` kuukausien seurannan jälkeen — ne on luotu "varmuuden vuoksi" tai vanhoja kyselyitä varten, joita ei enää ajeta.

Jokainen indeksi hidastaa kirjoituksia — PostgreSQL päivittää kaikki relevantit indeksit jokaisessa muutoksessa.

## Ratkaisu

**Poista käyttämättömät indeksit** deployn jälkeen varmistaessasi, ettei raportti, batch-job tai harvinainen admin-kysely tarvitse niitä:

```sql
SELECT indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

DROP INDEX CONCURRENTLY idx_unused;
```

Nollaa stats deployn jälkeen (`pg_stat_reset()`) vain tietoisesti — muuten vanha historia on arvokas.

## Taustaa

Indeksien määrä on write-latenssin vihollinen. Säännöllinen "index hygiene" on osa PostgreSQL-kapasiteettisuunnittelua.

[Lue lisää](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
