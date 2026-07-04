# Usein `WHERE payload @> ...` jsonb-sarakkeessa. Indeksi?

## Tilanne

Tuotannossa `events`-taulun `payload` JSONB-sarakkeessa on miljoonia rivejä. Sovellus ajaa jatkuvasti containment-kyselyitä:

```sql
SELECT id, payload
FROM events
WHERE payload @> '{"type": "login", "success": true}'::jsonb;
```

Ilman indeksiä planner tekee seq scanin — jokainen rivi purkautuu ja verrataan. Latenssi kasvaa lineaarisesti taulun koon mukana. B-tree-indeksi JSONB-sarakkeella **ei** tue `@>`-operaattoria.

## Ratkaisu

Luo **GIN-indeksi** JSONB-sarakkeelle:

```sql
-- Yleinen GIN (jsonb_ops) — tukee useita operaattoreita (@>, ?, ?&, ?|)
CREATE INDEX events_payload_gin ON events USING gin (payload);

-- Vaihtoehto: jsonb_path_ops — pienempi indeksi, vain @> ja @? (PG 12+)
CREATE INDEX events_payload_gin_path ON events USING gin (payload jsonb_path_ops);
```

Valinta riippuu työkuormasta:

- **`jsonb_ops` (oletus):** monipuolisemmat kyselyt (`?`-avaimet, useat operaattorit).
- **`jsonb_path_ops`:** pienempi indeksi, nopeampi `@>` kun et tarvitse muita operaattoreita.

Tarkista suunnitelma:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM events
WHERE payload @> '{"type": "login"}'::jsonb;
-- Odotus: Bitmap Index Scan käyttäen events_payload_gin
```

## Käytännössä

GIN on PostgreSQLin standardi JSONB-haun indeksi. Indeksin koko kasvaa — seuraa levytilaa ja `pg_stat_user_indexes`-käyttöä. Jos kyselyt ovat aina saman avaimen (`status`, `type`) ympärillä, harkitse myös generated column + B-tree hybridimallia.

`jsonb_path_ops` kannattaa, jos 95 % kyselyistä on `@>` containment — muuten pidä oletus `jsonb_ops`.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
