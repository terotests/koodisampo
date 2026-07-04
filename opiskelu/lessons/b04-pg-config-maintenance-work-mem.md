# CREATE INDEX kestää tunteja isolla taululla — logissa 'external sort'. Mitä parametria nostat session tasolla?

## Tilanne

`CREATE INDEX CONCURRENTLY` tai tavallinen `CREATE INDEX` massiivisella taululla kestää tunteja. Lokissa näkyy `external sort` tai temp-tiedostoja — indeksin rakennus sorttaa avainarvoja muistissa ennen kuin kirjoittaa B-tree-lehdet.

Indeksin rakennus käyttää **maintenance_work_mem** -parametria, ei `work_mem`:ia. `work_mem` rajoittaa SELECT-kyselyiden sort/hash-operaatioita. Sekoittaminen johtaa turhaan `work_mem`-nostoon, joka ei nopeuta indeksin rakennusta.

Session-tason nostolla voit nopeuttaa yhtä maintenance-operaatiota ilman globaalia muutosta koko instanssille.

## Ratkaisu

**maintenance_work_mem — indeksin rakennus ja VACUUM** on oikea parametri. Se määrittää muistin, jota CREATE INDEX, REINDEX ja VACUUM FULL -tyyppiset operaatiot saavat käyttää sorttauksessa.

```sql
SET maintenance_work_mem = '2GB';
CREATE INDEX CONCURRENTLY idx_orders_created ON orders(created_at);
RESET maintenance_work_mem;
```

Suurempi arvo vähentää levylle sorttausta (external sort) ja nopeuttaa indeksin rakennusta. Rajoite: liian suuri globaali arvo × useita rinnakkaisia VACUUM/INDEX-operaatioita voi kuluttaa paljon RAM:ia.

## Taustaa

`work_mem` vaikuttaa query sort/hash -solmuihin SELECTissä. `maintenance_work_mem` on erillinen — PostgreSQL dokumentaatio erottaa nämä tarkoituksella.

CONCURRENTLY-indeksi rakennetaan useassa vaiheessa; muistin lisäys auttaa mutta ei poista kaikkea I/O:ta. Harkitse myös `max_parallel_maintenance_workers` (PG 11+).
