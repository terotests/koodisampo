# Organisaatiopuu: esimies–alainen hierarkia taulussa `parent_id`. Miten haet koko alipuun?

## Tilanne

Organisaatiotaulu: `id`, `name`, `parent_id` (NULL juurella). Haluat kaikki alaiset tietyn managerin alle — puu on rekursiivinen, yksittäinen JOIN ei riitä syvälle hierarkialle.

Iteratiivinen sovelluskoodi on hidas ja monimutkainen.

## Ratkaisu

**Recursive CTE:**

```sql
WITH RECURSIVE tree AS (
  -- ankkuri: juuri (esimies)
  SELECT id, name, parent_id, 1 AS depth
  FROM employees
  WHERE id = :manager_id

  UNION ALL

  -- rekursio: lapset
  SELECT e.id, e.name, e.parent_id, t.depth + 1
  FROM employees e
  JOIN tree t ON e.parent_id = t.id
)
SELECT * FROM tree;
```

`UNION ALL` yhdistää ankkuririvit ja rekursiiviset laajennukset, kunnes ei uusia rivejä. PostgreSQL tukee `CYCLE`-detectionia PG 14+ syklisen datan käsittelyyn.

## Taustaa

Recursive CTE on standardi tapa hierarkioihin (org chart, BOM, kategoriat). Varmista indeksi `(parent_id)` nopeaan rekursioon.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
