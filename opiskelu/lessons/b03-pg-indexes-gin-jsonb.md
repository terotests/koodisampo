# JSONB metadata-kenttä `@> '{"status":"active"}'` query hidas seq scan. Indeksi?

## Tilanne

Sovellus tallentaa metadataa JSONB-sarakkeeseen ja hakee containment-operaattorilla:

```sql
SELECT * FROM events WHERE metadata @> '{"status": "active"}';
```

5M rivillä seq scan on hidas. B-tree-indeksi JSONB-sarakkeella ei tue `@>`-operaattoria — planner ei voi käyttää sitä.

## Ratkaisu

**GIN-indeksi** JSONB-sarakkeelle:

```sql
CREATE INDEX ON events USING GIN (metadata);
```

GIN (Generalized Inverted Index) on suunniteltu composite-arvojen ja containment-kyselyiden (`@>`, `?`, `?&`, `?|`) indeksointiin. Valinnainen `jsonb_ops` vs `jsonb_path_ops` vaikuttaa koko/hyöty trade-offiin.

Tarkista `EXPLAIN`: Bitmap Index Scan GIN-indeksillä.

## Taustaa

JSONB-indeksointi on PostgreSQLin vahvuus — mutta vain oikealla indeksityypillä. B-tree toimii JSONB:lle vain tietyillä cast/operaattori-yhdistelmillä, ei yleiselle `@>`-haulle.

[Lue lisää](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
