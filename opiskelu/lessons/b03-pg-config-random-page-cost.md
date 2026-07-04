# Migrated DB SSD:lle — index scan suunnitelmat ovat hitaita. Säädä?

## Tilanne

Tietokanta siirrettiin HDD-palvelimelta NVMe/SSD-levylle. Odotit nopeutumista, mutta monet kyselyt käyttävät edelleen index scan -suunnitelmia, jotka tuntuvat hitailta — tai planner valitsee suunnitelmia, jotka eivät vastaa uutta levyn profiilia.

PostgreSQLin oletus `random_page_cost = 4.0` on historiallinen HDD-arvio: satunnainen 8K-sivun luku on kallis verrattuna peräkkäiseen seq scan -lukuun. SSD:llä satunnaisen sivun luku on lähes yhtä halpaa kuin peräkkäinen — cost-malli on vanhentunut.

Planner laskee edelleen index scanin kalliiksi (monta random readia), vaikka levy kestää ne hyvin. Joudut säätämään cost-parametreja heijastamaan SSD:tä, jotta suunnitelmat vastaavat todellisuutta.

## Ratkaisu

**random_page_cost alas (esim. 1.1) SSD:lle — planner realismi** on oikea säätö. Tyypillinen lähtöarvo NVMe/SSD:lle on 1.0–1.5 (usein 1.1), kun `seq_page_cost` pysyy 1.0:ssa.

```ini
random_page_cost = 1.1
seq_page_cost = 1.0
```

Näin planner ei rankaise index scania liikaa verrattuna seq scan -iin. Muutos vaatii vain reloadin (`pg_reload_conf()`), ei restartia.

Yhdistä usein `effective_cache_size` -nostoon: suurella RAM:illa ja SSD:llä index scan on usein oikea valinta suurelle osalle taulusta.

## Taustaa

Älä kopioi arvoja sokeasti — mittaa `EXPLAIN (ANALYZE, BUFFERS)` ennen ja jälkeen. Joillakin workloadilla seq scan on silti oikein (hyvin suuri taulu, pieni selectivity).

Cloud-managed Postgres (RDS, Cloud SQL) voi asettaa osan parametreista puolestasi; tarkista dokumentaatio.
