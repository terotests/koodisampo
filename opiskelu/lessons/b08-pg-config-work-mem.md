# Monimutkainen sort/hash query spillaa diskiin — temp files kasvavat. Parametri?

## Tilanne

Monimutkainen SELECT — useita JOINeja, GROUP BY, ORDER BY — luo kasvavia temp-tiedostoja `pgsql_tmp`-hakemistoon. `EXPLAIN ANALYZE` näyttää sort/hash-operaatiot, jotka spillaa levylle. Levy-I/O on pullonkaula koko instanssille.

Sort- ja hash-operaatiot saavat oman muistikattonsa **`work_mem`** per solmu. Kun yksi solmu ylittää rajan, PostgreSQL kirjoittaa väliaikaista dataa levylle. Ongelma toistuu, kunnes oikea parametri nostetaan — tai kysely optimoidaan.

## Ratkaisu

**work_mem — sort/hash-muisti per operaatio, kerro concurrent ops huomioiden** hallitsee spilliä.

```sql
SET work_mem = '128MB';
```

Huomioi kerroin: yhdessä kyselyssä voi olla **useita** sort/hash-solmuja, jokainen voi käyttää enintään `work_mem` verran. Lisäksi monta rinnakkaista istuntoa × korkea `work_mem` = OOM-riski.

Nosta ensin yhdelle raportti-istunnolle. Mittaa temp file -koko ja muistipaine ennen globaalia nostoa `postgresql.conf`:ssa.

## Taustaa

`maintenance_work_mem` vaikuttaa VACUUMiin ja CREATE INDEX -operaatioihin — ei SELECT-sorttiin. `shared_buffers` on page cache — eri tarkoitus.

Pysyvä ratkaisu: indeksi sort orderlle, pienempi result set, materialisoitu näkymä.
