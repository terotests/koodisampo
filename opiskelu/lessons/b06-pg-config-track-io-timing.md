# pg_stat_statements näyttää query time mutta ei I/O breakdown. Mitä enable?

## Tilanne

`pg_stat_statements` kertoo aggregoidun suoritusajan (`total_exec_time`, `mean_exec_time`), mutta et näe erikseen levylukujen kestoa. Kysely voi olla hidas joko CPU:n, lukituksen tai I/O:n takia — pelkkä kokonaisaika ei riitä juurisyyanalyysiin.

PostgreSQL voi mitata I/O-operaatioiden kestoa (`blk_read_time`, `blk_write_time` statistiikoissa), mutta oletusarvoisesti I/O timing on **pois päältä**, koska se lisää overheadia jokaisessa block read/write -kutsussa.

Diagnostiikka-ikkunassa tarvitset GUC:n, joka kytkee I/O-aikamittauksen päälle.

## Ratkaisu

**track_io_timing = on — mittaa I/O-operaatioiden keston diagnostiikkaan**. Kun päällä, `pg_stat_statements` (riittävän uudessa PG-versiossa) ja `pg_stat_database` voivat raportoida I/O-aikaan liittyviä metriikoita.

```ini
track_io_timing = on
```

Vaatii yleensä reloadin. Overhead on pieni modernissa laitteistossa, mutta pidä pois päältä extreme-low-latency OLTP:ssä jos profilointi ei ole tarpeen.

Yhdistä `pg_stat_statements` + `EXPLAIN (ANALYZE, BUFFERS)` yksittäisen kyselyn syvempään analyysiin.

## Taustaa

`log_statement` tai `auto_explain` eivät korvaa I/O timing -statistiikkaa. `track_io_timing` on statistics-osio GUC.

Cloud-managed instansseissa parametri voi olla rajoitettu — tarkista provider.
