# Taulu on 50 GB mutta sisältää paljon dead tupleja — pg_stat_user_tables. Toimenpide?

## Tilanne

50 GB taulu, `n_dead_tup` korkea, `last_autovacuum` vanha tai autovacuum ei pysynyt UPDATE-kuormassa. Raportit hidastuvat — enemmän sivuja skannattavana kuin live data vaatisi.

## Ratkaisu

```sql
VACUUM (ANALYZE, VERBOSE) big_table;
```

Manuaalinen vacuum kickstart + stats-päivitys. Sitten:

1. Tarkista autovacuum-asetukset (scale_factor)
2. Selvitä pitkät transaktiot
3. Jos levytila kriittinen: **pg_repack** tai VACUUM FULL off-peak

Autovacuum "ei pysynyt" — säädä parametrit estämään toisto.

## Taustaa

50 GB taulussa manuaalinen VACUUM voi kestää — suunnittele maintenance-ikkuna. VERBOSE näyttaa edistymisen.

[Lue lisää](https://www.postgresql.org/docs/current/sql-vacuum.html)
