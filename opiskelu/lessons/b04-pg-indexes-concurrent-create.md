# Tuotantotauluun uusi indeksi — CREATE INDEX lukitsee kirjoitukset tunteiksi. Vaihtoehto?

## Tilanne

500 GB tuotantotauluun tarvitaan uusi indeksi. Arvio: rakennus kestää 4–8 tuntia. Normaali `CREATE INDEX` estää kirjoitukset merkittävän osan ajasta — migraatio-ikkuna ei riitä, eikä read replica auta (indeksi rakennetaan primääriin).

## Ratkaisu

```sql
CREATE INDEX CONCURRENTLY idx_big_table_col ON big_table (col);
```

CONCURRENTLY skannaa taulun kahteen kertaan ja rakentaa indeksin ilman pitkää exclusive lockia DML-operaatioille. Rakennusaika on pidempi ja CPU/I/O-kuorma korkeampi — mutta palvelu pysyy kirjoitettavana.

Seuraa etenemistä `pg_stat_progress_create_index`:stä (PG 12+). Jos indeksi jää invalidiksi, `DROP INDEX CONCURRENTLY` + uudelleenyritys.

## Tauntauksen vs tuotannon ero

Stagingissa normaali CREATE INDEX on nopeampi ja yksinkertaisempi. Tuotannossa tuntien mittakaava tekee CONCURRENTLY:stä pakollisen.

[Lue lisää](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
