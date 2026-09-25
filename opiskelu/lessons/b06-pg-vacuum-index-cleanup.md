# Taulu on vacuumoitu säännöllisesti, mutta sen indeksit ovat kasvaneet moninkertaisiksi UPDATE-kuormassa. Mitä teet?

## Tilanne

Autovacuum pysyy ajan tasalla ja taulun dead tuplet siivotaan, mutta `pg_relation_size` näyttää indeksien kasvaneen moninkertaisiksi. UPDATE-raskas kuorma jättää indeksisivuille tyhjää tilaa, ja indeksi-scanit lukevat turhia sivuja.

## Ratkaisu

Paisunut indeksi rakennetaan uudelleen ilman pitkää kirjoituslukkoa:

```sql
REINDEX INDEX CONCURRENTLY idx_orders_status;
-- tai koko taulu ja sen indeksit: pg_repack
```

Ennen sitä kannattaa mitata, mitkä indeksit oikeasti ovat paisuneet (esim. `pgstattuple`-laajennuksen `pgstatindex()`).

## Taustaa

`VACUUM` poistaa indekseistä kuolleiden rivien osoittimet (`INDEX_CLEANUP`, oletuksena `AUTO`) ja merkitsee tyhjät sivut uudelleenkäytettäviksi, mutta **ei kutista indeksitiedostoa** eikä palauta tilaa käyttöjärjestelmälle. Tavallinen `REINDEX` lukitsee kirjoitukset koko rakennuksen ajaksi; `CONCURRENTLY` kestää pidempään mutta ei pysäytä tuotantoa. HOT-päivitykset (`fillfactor` < 100) vähentävät indeksien kasvua jatkossa.

[Lue lisää](https://www.postgresql.org/docs/current/sql-reindex.html)
