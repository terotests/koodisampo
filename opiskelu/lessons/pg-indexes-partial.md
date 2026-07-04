# Kyselyt kohdistuvat usein `WHERE archived = false`. Indeksi on iso ja hidas. Ratkaisu?

## Tilanne

Täysi indeksi `(updated_at)` tai `(status)` kattaa myös arkistoidut rivit — indeksi on turhan suuri, ylläpito raskasta, ja cache-osumat huonoja. Kaikki tuotantokyselyt suodattavat `archived = false`, mutta indeksi ei hyödynnä tätä.

## Ratkaisu

**Partial index:**

```sql
CREATE INDEX ON documents (updated_at)
WHERE archived = false;
```

Indeksi sisältää vain ei-arkistoidut rivit — pienempi, nopeampi, parempi write-latenssi. WHERE-lauseen on vastattava kyselyjen logiikkaa.

Yhdistä tarvittaessa composite: `(status, updated_at) WHERE archived = false`.

## Taustaa

Partial index on PostgreSQLin tehokkain tapa rajata indeksin laajuutta ilman taulun pilkkomista. Expert-tason kysymys korostaa archived=false -patternin yleisyyttä SaaS-sovelluksissa.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-partial.html)
