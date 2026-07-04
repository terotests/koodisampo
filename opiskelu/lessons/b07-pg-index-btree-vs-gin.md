# JSONB @> query on hidas seq scanilla. Mikä indeksityyppi?

## Tilanne

```sql
SELECT * FROM configs WHERE payload @> '{"env": "prod"}';
```

Seq scan kaikilla riveillä. Kehittäjä luo btree-indeksin `(payload)` — ei auta. JSONB containment vaatii erityisen indeksirakenteen.

## Ratkaisu

**GIN-indeksi JSONB-sarakkeelle:**

```sql
CREATE INDEX ON configs USING GIN (payload);
```

GIN tukee `@>` containment-operaattoria. B-tree ei ole oletusvalinta JSONB:lle — se on relaatiomallin yleisindeksi, ei dokumenttihaulle.

Tarkista `EXPLAIN`: odota Bitmap Index Scan GIN-indeksillä.

## Taustaa

Sama ratkaisu kuin muissa JSONB `@>` -kysymyksissä — GIN on PostgreSQLin standardivastaus. jsonb_path_ops vs jsonb_ops vaikuttaa indeksin kokoon ja tuettuihin operaattoreihin.

[Lue lisää](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
