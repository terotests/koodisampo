# Heavy HOT update -taulu bloataa nopeasti vaikka autovacuum päällä. Taulutason säätö?

## Tilanne

Yksi rivi päivitetään usein samoilla sarakkeilla (esim. `counter`, `last_seen`). PostgreSQL yrittää **HOT update** -optimointia: jos päivitetyt sarakkeet eivät ole indeksissä, indeksiä ei päivitetä — mutta rivi tarvitsee silti tilaa samalla sivulla.

Kun sivu on täynnä, HOT ei onnistu → uusi riviversio toiselle sivulle → indeksipäivitys → bloat. Autovacuum siivoaa dead tupleja, mutta indeksin churn jatkuu.

## Ratkaisu

Aseta taululle **`FILLFACTOR < 100`** — jättää tyhjää tilaa sivuille HOT-päivityksille:

```sql
ALTER TABLE sessions SET (fillfactor = 70);
-- tai CREATE TABLE ... WITH (fillfactor = 70)
VACUUM FULL sessions;  -- tai uudelleenrakennus migraatiossa
```

70–90 on tyypillinen UPDATE-heavy tauluille. Indekseillä voi olla erillinen fillfactor. Tavoite: vähentää indeksipäivityksiä ja bloatia, ei korvata autovacuumia.

## Taustaa

FILLFACTOR on storage-parametri, ei query-GUC. Se vaikuttaa vain uusiin sivuihin — olemassa olevat sivut vaativat RECLUSTER/rewrite-migraation täyteen hyötyyn.

[Lue lisää](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
