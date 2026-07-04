# Monimutkainen sort overflowaa levylle — temp files kasvavat. Mikä parametri vaikuttaa sort-muistiin per operaatio?

## Tilanne

Monimutkainen kysely — useita ORDER BY -solmuja, hash join tai GROUP BY — luo `pgsql_tmp`-hakemistoon kasvavia temp-tiedostoja. `EXPLAIN ANALYZE` näyttää `Sort` → `Disk` tai hash, joka spillaa. Jokainen sort/hash-operaatio saa oman muistikattonsa; kun se ylittyy, data virtaa levylle.

Temp file -I/O on pullonkaula koko instanssille. Ongelma toistuu, kunnes sort/hash-operaatioiden muistirajaa nostetaan **oikealla parametrilla** — ei maintenance eikä shared buffers.

## Ratkaisu

**work_mem — sort/hash-muisti per operaatio, kerro max_connections huomioiden** hallitsee sort- ja hash-operaatioiden muistia. Jokainen sort/hash *solmu* voi käyttää enintään `work_mem` verran (tietyt operaatiot voivat käyttää enemmän erikoistapauksissa — lue docs).

```sql
SET work_mem = '128MB';
```

Globaali nosto postgresql.confissa vaikuttaa kaikkiin yhteyksiin. Vaarakaava: `work_mem × aktiiviset sortit × yhteydet` — liian korkea globaali arvo → OOM.

Nosta ensin raportti-istunnolle, mittaa temp file -koko (`pg_stat_database.temp_files` / lokista).

## Taustaa

`maintenance_work_mem` = VACUUM, CREATE INDEX. `shared_buffers` = page cache. Sekoitus näihin on yleisin virhe work_mem -kysymyksissä.

Pysyvä ratkaisu voi olla kyselyn optimointi (indeksi sort orderlle, pienempi result set).
