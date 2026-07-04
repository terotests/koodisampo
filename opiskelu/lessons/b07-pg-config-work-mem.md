# Monimutkainen sort spillaa diskiin — logissa temporary file. Mitä nostat?

## Tilanne

Raportti- tai analytiikkakysely tuottaa lokissa `temporary file` -viestejä ja `pgsql_tmp`-hakemistoon kasvavia tiedostoja. `EXPLAIN ANALYZE` paljastaa `Sort` tai `Hash` -solmun, jossa data spillaa levylle — muistikatto ylittyy.

Sort/hash-operaatiot käyttävät **`work_mem`** -parametria per solmu, ei `shared_buffers` eikä `maintenance_work_mem`. Kun sort spillaa, ensimmäinen vipu on `work_mem` — mutta nostaminen vaatii varovaisuutta, koska useat rinnakkaiset operaatiot voivat kuluttaa paljon RAM:ia.

## Ratkaisu

**work_mem — sort/hash-muisti per operaatio, nosta varovasti yhteyksien kanssa** on oikea parametri.

```sql
SET work_mem = '256MB';
-- raskas SELECT ...
RESET work_mem;
```

Globaali nosto `postgresql.conf`:ssa vaikuttaa kaikkiin istuntoihin. Vaarakaava: monta sort/hash-solmua × korkea `work_mem` × samanaikaiset yhteydet → OOM-riski. Aloita session-tason nostolla yhdelle raportille.

Mittaa: temp file -koko, query-kesto, muistipaine. Jos spill katoaa, harkitse pysyvää nostoa maltillisesti.

## Taustaa

`maintenance_work_mem` = VACUUM, CREATE INDEX. `shared_buffers` = page cache. Sekoitus on yleisin virhe.

Pysyvä ratkaisu voi olla kyselyn optimointi (indeksi, pienempi joukko, materialisoitu näkymä) — `work_mem` on usein paikkaus, ei lopullinen korjaus.
