# Sama alikysely toistuu kolmessa kohdassa raportissa. Miten refaktoroit?

## Tilanne

Raporttikyselyssä sama monimutkainen alikysely (JOINit, suodattimet, aggregaatit) toistuu kolmessa SELECT-haarassa. Muutos logiikkaan vaatii kolmen kohdan päivitystä — copy-paste virheitä ja ylläpito-ongelmia.

## Ratkaisu

**CTE (Common Table Expression)** — yksi lähde, useita viittauksia:

```sql
WITH base AS (
  SELECT o.id, o.total, c.region
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  WHERE o.created_at >= '2024-01-01'
)
SELECT region, count(*) FROM base GROUP BY region
UNION ALL
SELECT 'total', count(*) FROM base;
```

`base` määritellään kerran; kaikki seuraavat SELECTit viittaavat samaan result setiin. PostgreSQL 12+ voi inlineata tai materialisoida — tarvittaessa `AS MATERIALIZED`.

## Taustaa

CTE parantaa luettavuutta ja DRY-periaatetta. Se ei aina nopeuta suoritusta — mutta vähentää virheitä ja helpottaa testausta (aja vain `base`-osa erikseen).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
