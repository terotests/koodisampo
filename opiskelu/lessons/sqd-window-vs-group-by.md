# Tarvitset rivin arvon JA koko taulun keskiarvon samalla rivillä ilman self-joinia.

## Tilanne

Jokaisella myyntirivillä haluat näyttää: `amount`, ja rinnalla `avg_amount` (koko taulun keskiarvo). Self-join `(SELECT AVG(amount) FROM sales)` correlated subqueryna toimii, mutta on turha monimutkainen.

GROUP BY bez partitionia tuottaa yhden rivin — ei yksittäisiä rivejä.

## Ratkaisu

**Ikkunafunktio ilman PARTITION BY** — koko result set on yksi ikkuna:

```sql
SELECT
  product,
  amount,
  AVG(amount) OVER () AS avg_amount,
  amount - AVG(amount) OVER () AS diff_from_avg
FROM sales;
```

`OVER ()` ilman PARTITION BY laskee aggregaatin kaikille riveille ja toistaa saman arvon jokaisella rivillä. Ei self-joinia, ei correlated subquerya.

Voit yhdistää: `AVG(amount) OVER (PARTITION BY region)` aluekohtaiseen keskiarvoon.

## Taustaa

Ikkunafunktiot säilyttävät rivin granulariteetin toisin kuin GROUP BY. Tyhjä OVER () on "koko taulu yhtenä partitionina".

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
