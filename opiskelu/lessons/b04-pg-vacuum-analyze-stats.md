# Planner valitsee seq scanin vaikka indeksi on — pg_stats näyttää vanhentuneet arvot. Toimenpide?

## Tilanne

Indeksi on olemassa, selectivity hyvä, mutta planner valitsee seq scanin. `pg_stats` (tai `\d+ table`) näyttää `n_distinct` ja rivimäärät, jotka eivät vastaa todellisuutta — esim. arvio 1000 riviä, todellisuus 1M.

Vanhentuneet tilastot ovat yleisin syy huonoon suunnitelmaan indeksin olemassa ollessa.

## Ratkaisu

```sql
ANALYZE problem_table;
```

tai odota autovacuum analyze -triggeriä (`autovacuum_analyze_scale_factor`). Bulk muutosten jälkeen manuaalinen ANALYZE on luotettavampi. Varmista `EXPLAIN`:n jälkeen, että `rows estimate` vastaa paremmin `actual rows`.

## Taustaa

ANALYZE on osa vacuum-ekosysteemiä — autovacuum voi ajaa sen automaattisesti, mutta ei aina tarpeeksi nopeasti aktiivisten taulujen kohdalla.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-STATISTICS)
