# Query: WHERE tenant_id = ? AND created_at > ? ORDER BY created_at. Yksi indeksi — mikä järjestys?

## Tilanne

Multi-tenant listaus: suodata tenant, rajaa aika, järjestä uusimmat ensin. Kolme operaatiota — yksi composite-indeksi voi palvella kaikkia, jos sarakejärjestys on oikein.

Väärä järjestys `(created_at, tenant_id)` pakottaa seq scanin tai tehotonta sorttia.

## Ratkaisu

```sql
CREATE INDEX ON events (tenant_id, created_at);
```

**`(tenant_id, created_at)`** — equality (`tenant_id`) ensin, range ja ORDER BY (`created_at`) toisena. Planner voi tehdä Index Scan tenantin rivit `created_at`-järjestyksessä ilman erillistä Sort-solmua.

Sääntö: equality-sarakkeet → range-sarakkeet → ORDER BY -sarakkeet samassa järjestyksessä kuin indeksin avaimet.

## Taustaa

Yksi hyvin suunniteltu composite-indeksi korvaa usein useita yksittäisiä indeksejä multi-tenant-kyselyissä. Varmista `EXPLAIN`:lla Sort-solmun katoaminen.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
