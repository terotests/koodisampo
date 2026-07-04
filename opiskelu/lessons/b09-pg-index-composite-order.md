# Kysely `WHERE tenant_id = ? AND created_at > ?` — index (created_at, tenant_id) ei käytetä. Miksi?

## Tilanne

Multi-tenant SaaS: jokainen kysely rajaa `tenant_id = 42` ja aikarange `created_at > '2024-01-01'`. Indeksi `(created_at, tenant_id)` on luotu — mutta `EXPLAIN` näyttää seq scanin tai tehotonta indeksikäyttöä.

Sarakkeiden järjestys composite-indeksissä on väärä suhteessa WHERE-ehtojen tyyppeihin.

## Ratkaisu

**Equality-sarake ensin, range toisena:**

```sql
CREATE INDEX ON events (tenant_id, created_at);
```

`tenant_id = ?` on equality (tarkka rajaus), `created_at > ?` on range. B-tree hyödyntää indeksiä parhaiten, kun equality-sarakkeet tulevat ensin — planner skannaa tenantin rivit ja käyttää `created_at`-osaa range-hakuun.

Väärä järjestys `(created_at, tenant_id)` ei tue tehokkaasti tenant-kohtaista range-hakua.

## Taustaa

Sama sääntö kuin `(status, created_at)` ja `(tenant_id, created_at)` — equality ennen rangea. ORDER BY `created_at` hyötyy samasta indeksistä tenant-rajauksen kanssa.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
