# Iso aggregation ei käytä parallel workers vaikka max_parallel_workers_per_gather > 0. Tarkista ensin?

## Tilanne

`max_parallel_workers_per_gather = 4` on asetettu, mutta `EXPLAIN` isosta `GROUP BY` / `COUNT(*)` -kyselystä näyttää vain serial planin ilman `Gather`-solmua. CPU jää alikäytettyksi, vaikka taulussa on miljoonia rivejä.

Rinnakkaisuus ei ole automaattinen — planner hylkää sen useista syistä.

## Ratkaisu

Tarkista järjestyksessä:

1. **Onko kysely parallel safe?** `EXPLAIN` kertoo `Parallel unsafe` tai `Parallel restricted` jos funktiot, CTE:t tai cursorit estävät rinnakkaisuuden.
2. **Näkyykö `Gather` / `Gather Merge`?** Jos ei, taulu voi olla liian pieni (`min_parallel_table_scan_size`) tai cost-arvio alittaa kynnyksen (`parallel_setup_cost`, `parallel_tuple_cost`).
3. **Write-operaatiot ja transaktioasetukset** — `SET max_parallel_workers_per_gather = 0` istunnossa, `maintenance_work_mem` ei vaikuta query parallel gatheriin.

Testaa:

```sql
SET force_parallel_query = on;  -- vain debug, ei tuotantoon
EXPLAIN SELECT count(*) FROM big_table;
```

Poista `force_parallel_query` tuotannosta — se on diagnostiikkatyökalu.

## Taustaa

Parallel query jakaa scan/aggregation worker-prosesseille. Se maksaa overheadia pienillä kyselyillä — planner voi olla oikeassa jättäessään sen pois.

[Lue lisää](https://www.postgresql.org/docs/current/parallel-query.html)
