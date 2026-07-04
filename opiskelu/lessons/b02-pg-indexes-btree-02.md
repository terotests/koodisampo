# WHERE status = 'active' AND created_at > '2024-01-01' — yleisin indeksityyppi?

## Tilanne

Raporttikysely suodattaa sekä tilan (`status = 'active'`) että aikarajan (`created_at > '2024-01-01'`). Taulussa on 10M riviä ja seq scan kestää sekunteja. Tarvitset indeksin, joka tukee molempia ehtoja tehokkaasti.

PostgreSQLin oletusindeksityyppi kattaa useimmat vertailu- ja range-kyselyt. Erikoisindeksit (GIN, GiST, BRIN) ovat tarkoitettu JSONB:lle, geometrialle tai aikasarjoille — ei tähän tapaukseen.

## Ratkaisu

**B-tree composite index** oikealla sarakejärjestyksellä:

```sql
CREATE INDEX ON orders (status, created_at);
```

Equality-ehto (`status`) tulee ensin, range (`created_at`) toiseksi — planner voi käyttää indeksiä molempiin ehtoihin. Yksittäinen indeksi vain `created_at`:lle ei hyödytä, jos `status`-filtteri on pakollinen jokaisessa kyselyssä.

## Taustaa

B-tree on PostgreSQLin oletus `USING btree` ja sopii `=`, `<`, `>`, `BETWEEN` -operaattoreihin. Varmista `EXPLAIN`:lla, että suunnitelma käyttää indeksiä — ANALYZE pitää tilastot ajan tasalla.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-types.html)
