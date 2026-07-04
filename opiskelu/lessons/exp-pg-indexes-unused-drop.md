# Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan = 0 kuukausien jälkeen. Toimenpide?

## Tilanne

Tuotantokanta on kasvanut, INSERT-latenssi huonontunut. Audit paljastaa indeksejä, joita ei ole koskaan käytetty (`idx_scan = 0` kuukausista statsista). Ne on luotu varmuuden vuoksi, vanhoista migraatioista tai poistuneista featureista.

Dead index on puhdas kustannus ilman hyötyä.

## Ratkaisu

**Harkitse DROP INDEX:**

```sql
SELECT schemaname, relname, indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

DROP INDEX CONCURRENTLY idx_dead;
```

Varmista ennen poistoa: ei käyttöä `pg_stat_statements`:ssa, ei ulkoisia BI-työkaluja, ei tulevia featureita. Dokumentoi poisto ja seuraa write-latenssia.

## Taustaa

Indeksien määrä skaalaa write-kustannusta lineaarisesti. Kuukausien `idx_scan = 0` on vahva signaali — poikkeukset (vuosiraportti) kannattaa mitata erikseen.

[Lue lisää](https://www.postgresql.org/docs/current/monitoring-stats.html)
