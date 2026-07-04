# Query hidas tuotannossa — haluat todelliset ajat ei arvion. Komento?

## Tilanne

`EXPLAIN SELECT ...` näyttää suunnitelman ja plannerin arvioidut kustannukset, mutta `cost=50000` ei kerro millisekunteina, kuinka kauan kysely kestää tuotantodatassa. Arvio voi olla väärä, jos tilastot ovat vanhentuneet.

Haluat mitata todellisen suoritusajan ja rivimäärät — mutta et halua ajaa tuntematonta raskasta kyselyä suoraan tuotannossa ruuhka-aikaan.

## Ratkaisu

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

**ANALYZE** suorittaa kyselyn ja tulostaa `actual time` ja `actual rows` jokaiselle solmulle. **BUFFERS** näyttää cache hit vs levyluvut. Aja komento **tuotantokopiossa tai stagingissa**, jossa data on edustava mutta kuormitus ei haittaa asiakkaita.

Pelkkä `EXPLAIN` ilman ANALYZE:a ei koskaan näytä todellisia aikoja — se on vain simulaatio. `SELECT *` tuotannossa mittaa kokonaisaikaa mutta ei kerro, mikä join- tai scan-solmu on pullonkaula.

## Käytännön vinkki

Vertaa `rows` (estimate) ja `actual rows`. Suuri ero selittää usein väärän suunnitelman — korjaa ensin `ANALYZE`:lla, vasta sitten indeksit.

[Lue lisää](https://www.postgresql.org/docs/current/sql-explain.html)
