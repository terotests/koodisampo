# Monimutkaiset sort/hash JOINit spillaa diskiin — temp files kasvaa. Parametri?

## Tilanne

Monimutkaiset JOINit yhdistettynä sort/hash-operaatioihin tuottavat temp-tiedostoja levyllä. Lokissa `temporary file` -viestit, `EXPLAIN` näyttää spillaavan sort/hash -solmun. Kysely toistuu hitaana jokaisella ajolla.

PostgreSQL allokoi sort- ja hash-operaatioille muistia **`work_mem`** per solmu. Kun operaatio ylittää rajan, data virtaa levylle. Tämä on erillinen parametri maintenance-operaatioista ja page cachesta.

## Ratkaisu

**work_mem — muistia sort/hash-operaatioille per operaatio** on oikea GUC.

```sql
SET work_mem = '256MB';
-- monimutkainen JOIN + ORDER BY
RESET work_mem;
```

Varoitus: `work_mem × sort/hash-solmut × samanaikaiset yhteydet` voi ylittää RAM:in. PostgreSQL runtime config varoittaa tästä — nosta session-tasolla ensin, mittaa, sitten harkitse globaalia arvoa.

`pg_stat_database.temp_files` ja `temp_bytes` kertovat spillin määrän instanssitasolla.

## Taustaa

`maintenance_work_mem` = VACUUM, REINDEX, CREATE INDEX. Sekoitus näihin on yleisin virhe work_mem -kysymyksissä.

Jos spill jatkuu korkeallakin `work_mem`:llä, optimoi kysely (indeksit, pienempi joukko, CTE-materialisointi).
