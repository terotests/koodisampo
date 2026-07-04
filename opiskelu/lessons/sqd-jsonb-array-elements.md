# JSON-taulukko `tags: ["a","b"]` — yksi rivi per tagi.

## Tilanne

Tuotteet tallennetaan JSONB-dokumentteina, ja jokaisella on taulukko `tags`:

```sql
SELECT payload FROM products LIMIT 1;
-- {"name": "Kamera", "tags": ["a", "b"]}
```

Raportti tarvitsee **yhden rivin per tagi** — esimerkiksi laske, montako tuotetta kullakin tagilla on, tai JOINaa tagit erilliseen sanastotauluun. Koko JSONB-dokumentti yhtenä rivinä ei riitä.

## Ratkaisu

PostgreSQL purkaa JSON-taulukon riveiksi set-returning -funktiolla:

```sql
-- Yksi rivi per tagi (text-arvona)
SELECT p.id, tag
FROM products p,
     jsonb_array_elements_text(p.payload->'tags') AS tag;

-- Tai jsonb_array_elements jos tarvitset JSONB-tyypin
SELECT p.id, elem
FROM products p,
     jsonb_array_elements(p.payload->'tags') AS elem;
```

Aggregointi tagin mukaan:

```sql
SELECT tag, count(*) AS product_count
FROM products p,
     jsonb_array_elements_text(p.payload->'tags') AS tag
GROUP BY tag
ORDER BY product_count DESC;
```

`jsonb_array_elements_text` on kätevä, kun tagit ovat merkkijonoja — ei tarvitse `->>`-castia.

## Käytännössä

LATERAL JOIN on usein selkeämpi kuin vanha pilkku-syntaksi:

```sql
SELECT p.id, t.tag
FROM products p
CROSS JOIN LATERAL jsonb_array_elements_text(p.payload->'tags') AS t(tag);
```

Jos taulukko voi puuttua tai olla null, suojaa `COALESCE(payload->'tags', '[]'::jsonb)`. Tyhjä taulukko ei tuota rivejä — jos haluat rivin ilman tageja, käytä `LEFT JOIN LATERAL`.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
