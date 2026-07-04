# Iso sort/hash join spillaa diskiin — logissa 'temporary file'. Parametri?

## Tilanne

Raskas raporttikysely tai monimutkainen JOIN tuottaa PostgreSQLin lokissa viestejä temporary file -tiedostoista. `EXPLAIN ANALYZE` näyttää `Sort` tai `Hash` -solmun, jossa `Disk:`-rivi kertoo levylle kirjoitetusta datasta. Sort/hash ei mahdu muistiin annetulla rajalla.

Levy-spill on magnitudin hitaampi kuin muistissa tapahtuva sort/hash. Temp-tiedostot kasvavat `pgsql_tmp`-hakemistossa, I/O kuormittaa levyä ja saman instanssin muut kyselyt hidastuvat. Ongelma toistuu jokaisella ajolla, kunnes muistirajaa nostetaan tai kyselyä optimoidaan.

Parametri, joka hallitsee sort- ja hash-operaatioiden muistikattoa per solmu (per operaatio), on `work_mem` — ei `shared_buffers` eikä `maintenance_work_mem`.

## Ratkaisu

**Kasvata work_mem session/query tasolla harkiten sort/hash spilliin** on oikea toimenpide. `work_mem` määrittää, kuinka paljon muistia yksittäinen sort-, hash- tai merge-operaatio saa ennen kuin se spillaa levylle.

Nosta istuntotasolla tai yksittäiselle raportille:

```sql
SET work_mem = '256MB';
-- raskas SELECT ...
RESET work_mem;
```

Globaali `postgresql.conf`-arvo vaikuttaa kaikkiin yhteyksiin. Vaara: monta rinnakkaista sort-operaatiota × korkea `work_mem` voi aiheuttaa OOM. PostgreSQL laskee rajat per operaatio, mutta useita operaatioita samassa kyselyssä voi olla useita sort/hash -solmuja.

## Tuotannossa

Aloita session-tason nostolla yhdelle batch-raportille. Jos spill katoaa, harkitse pysyvää nostoa varovasti. Vaihtoehto: optimoi kysely (indeksi, pienempi joukko, materialisoidut näkymät) — `work_mem` on paikkaus, ei aina pysyvä ratkaisu.

`maintenance_work_mem` vaikuttaa VACUUMiin ja CREATE INDEX -operaatioihin, ei SELECT-sorttiin.
