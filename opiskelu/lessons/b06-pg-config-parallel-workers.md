# Raporttikysely ei parallelize — seq scan yksin. Mitä parametria nostat?

## Tilanne

Pitkä SELECT suurella taululla käyttää yhden prosessin seq scania, vaikka palvelimella on useita CPU-ytimiä vapaana. PostgreSQL tukee parallel query -ominaisuutta (PG 9.6+), mutta se on oletuksena rajattu — worker-prosessit eivät lähde liikkeelle ilman riittäviä resursse- ja kustannusrajoja.

`EXPLAIN` ei näytä `Gather`-solmua. Syy voi olla liian matala `max_parallel_workers_per_gather`, liian pieni `max_parallel_workers` koko klusterille, tai kysely ei täytä parallel query -ehtoja — mutta ensimmäinen konfig-vipu on parallel worker -parametrit.

## Ratkaisu

**max_parallel_workers_per_gather ja max_parallel_workers — parallel query -asetukset** hallitsevat rinnakkaisuutta. `max_parallel_workers_per_gather` (oletus 2) = workerit per gather-solmu. `max_parallel_workers` = yläraja kaikille parallel-operaatioille instanssissa.

```ini
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_worker_processes = 8
```

`max_worker_processes` rajoittaa taustaprosessien kokonaismäärää (parallel + logical replication + muut). Reload riittää useimmille.

## Taustaa

Kaikki kyselyt eivät parallelize — cost threshold (`min_parallel_table_scan_size`, `parallel_setup_cost`) voi estää. Säädä parametrit ja tarkista `EXPLAIN` uudelleen.

Parallel query lisää CPU:ta mutta myös muistia (jokainen worker). Testaa raporttikyselyillä, ei OLTP:llä ensin.
