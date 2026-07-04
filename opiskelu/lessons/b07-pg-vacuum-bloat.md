# Taulu on 10 GB mutta data 2 GB — UPDATE-heavy workload. Mitä tapahtuu?

## Tilanne

Levynkulutus 10 GB, arvioitu live data ~2 GB. UPDATE-heavy kuorma tuottaa dead tupleja — normaali VACUUM merkitsee tilan vapaaksi **taulun sisällä**, mutta **ei palauta levytilaa käyttöjärjestelmälle**.

Taulu pysyy 10 GB:n kokoisena tiedostona.

## Ratkaisu

**Dead tuple -bloat.** `VACUUM` (autovacuum) siivoaa dead tuplet mutta ei shrinkaa tiedostoa. Levytilan palautus vaatii:

- **`VACUUM FULL`** (exclusive lock) tai
- **`pg_repack`** (online) tai
- taulun uudelleenluonti

Paralleelisti: paranna autovacuum-asetuksia ja poista pitkät transaktiot estämässä siivousta.

## Taustaa

Bloat ≠ wraparound. Bloat on levytilaongelma; wraparound on XID-ongelma. Molemmat ratkaistaan vacuum-perheellä eri tavoin.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
