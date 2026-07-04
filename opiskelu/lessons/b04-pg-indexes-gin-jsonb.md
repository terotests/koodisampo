# Kysely `WHERE data @> '{"status":"active"}'` JSONB-sarakkeessa on hidas 5M rivillä. Indeksityyppi?

## Tilanne

API tallentaa payloadin JSONB-sarakkeeseen `data` ja suodattaa aktiiviset:

```sql
SELECT id FROM items WHERE data @> '{"status": "active"}';
```

5M rivillä seq scan kestää sekunteja. Tavallinen btree-indeksi `(data)` ei tue JSONB containment-operaattoria — indeksi on olemassa mutta käyttämättä.

## Ratkaisu

```sql
CREATE INDEX ON items USING GIN (data);
```

**GIN-indeksi JSONB:lle** tukee `@>` containment-kyselyitä. Planner valitsee tyypillisesti Bitmap Index Scan → Bitmap Heap Scan.

Jos indeksi on jo olemassa mutta ei käytössä, tarkista: onko operaattori `@>` (ei `->>` tekstihaku), onko tilastot ajan tasalla (`ANALYZE`), ja käytetäänkö oikeaa GIN-operaattoriluokkaa.

## Taustaa

GIN-indeksi on suurempi ja hitaampi ylläpitää kuin btree — mutta JSONB containment ilman sitä skaalaa huonosti.

[Lue lisää](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
