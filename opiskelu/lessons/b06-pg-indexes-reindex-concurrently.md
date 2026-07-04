# Bloated index tuotannossa — REINDEX lukitsee taulu. Miten ilman downtime?

## Tilanne

Indeksi on paisunut (dead tupleja, split-sivuja) UPDATE-heavy kuormassa. `REINDEX idx_foo` ottaa exclusive lockin — kirjoitukset ja joskus lukemisetkin blokkaantuvat. Tuotannossa downtime ei kelpaa.

PostgreSQL 12+ tarjoaa concurrent-vaihtoehdon.

## Ratkaisu

```sql
REINDEX INDEX CONCURRENTLY idx_foo;
```

Rakentaa indeksin uudelleen ilman pitkää exclusive lockia tauluun. Vaihtoehto koko tietokannalle: `REINDEX TABLE CONCURRENTLY table_name` (PG 12+).

CONCURRENTLY vaatii enemmän resursseja ja voi epäonnistua — seuraa lokeja. Varmista myös, ettei juurisyy (bloat ilman vacuumia) toistu.

## Taustaa

REINDEX korjaa indeksin rakenteen, ei korvaa puuttuvaa autovacuumia. Bloatin ehkäisy: FILLFACTOR, partial index, säännöllinen vacuum.

[Lue lisää](https://www.postgresql.org/docs/current/sql-reindex.html)
