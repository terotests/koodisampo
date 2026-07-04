# Hash Join spillaa temp tiedostoon — query hidastuu 10x. work_mem liian pieni. Mitä näet?

## Tilanne

Raporttikyselyssä kaksi isoa taulua yhdistetään hash joinilla. `EXPLAIN ANALYZE` näyttää äkillisen hidastumisen: hash-taulu ei mahdu `work_mem`-rajoihin ja PostgreSQL spillaa välitiedot levylle (`temp file`, `Hash Batches: 2` tai enemmän).

Levyllä tapahtuva hash join on usein 5–20× hitaampi kuin muistissa pysyvä hash-taulu. Ongelma ei ole join-algoritmi itsessään vaan muistin riittämättömyys istunnon tasolla.

## Ratkaisu

`EXPLAIN ANALYZE` paljastaa spillin:

```
Hash Join
  Hash Batches: 4  Memory Usage: 4096kB
  -> ...
  Buffers: temp read=50000 written=50000
```

**Hash Batches > 1** tai korkeat **temp read/written** tarkoittavat spilliä. Korjaus: nosta **`work_mem`** varovasti istunnolle tai transaktiolle (ei globaalisti liian korkeaksi — jokainen sort/hash-operaatio voi käyttää jopa `work_mem` verran):

```sql
SET work_mem = '256MB';
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Muista: `work_mem` vaikuttaa myös sort- ja hash aggregate -operaatioihin, ei vain joiniin.

## Varoitus

Globaali `work_mem = '1GB'` 500 yhteydellä voi aiheuttaa OOM:n. Säädä istuntokohtaisesti raskaille raporteille tai käytä resurssiryhmää (`pg_cgroup` / connection poolin session-asetukset).

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM)
