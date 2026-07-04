# Monimutkainen polku JSONB:ssä SQL:llä (PG 12+). Funktio?

## Tilanne

Tilaukset tallennetaan JSONB:hen, ja jokaisella tilauksella on taulukko `orders` riveineen:

```sql
SELECT payload FROM sales LIMIT 1;
-- {
--   "orders": [
--     {"id": 1, "total": 50},
--     {"id": 2, "total": 250},
--     {"id": 3, "total": 80}
--   ]
-- }
```

Raportti tarvitsee kaikki rivit, joiden `total` on yli 100. Ketjutettu `->` ja `jsonb_array_elements` toimii, mutta ehto taulukon sisällä muuttuu nopeasti monimutkaiseksi ja vaikeasti ylläpidettäväksi.

PostgreSQL 12+ tarjoaa **JSONPath**-kielen polkukyselyihin.

## Ratkaisu

**`jsonb_path_query`** (tai `jsonb_path_query_array`) suorittaa JSONPath-lausekkeen:

```sql
SELECT jsonb_path_query(
  payload,
  '$.orders[*].total ? (@ > 100)'
) AS high_totals
FROM sales;
```

Polku `$.orders[*].total` valitsee kaikki total-arvot taulukosta. Ehto `? (@ > 100)` suodattaa ne, jotka ylittävät 100.

Rivit, joissa on osuma:

```sql
SELECT s.id, q.total
FROM sales s,
     jsonb_path_query(s.payload, '$.orders[*] ? (@.total > 100)') AS q(total);
```

GIN-indeksi tukee myös `@?` ja `@@`-operaattoreita JSONPath-kyselyille, kun indeksi on luotu oikein.

## Käytännössä

JSONPath sopii syviin rakenteisiin, ehdollisiin polkuihin ja taulukoiden suodatukseen yhdellä lausekkeella. Yksinkertaisiin avaimiin (`payload->>'status'`) pidä perusoperaattorit — ne ovat helpommin luettavia.

Testaa polku interaktiivisesti: `SELECT jsonb_path_query('{"a":1}'::jsonb, '$.a');`. Dokumentoi JSONPath-lausekkeet, koska ne eivät ole yhtä tunnettuja kuin SQL.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
