# Myyjän prosenttiosuus top-myynnistä raportissa. Ikkunafunktio?

## Tilanne

Raportissa jokaisella myyjällä: absoluuttinen myynti ja suhteellinen sijoitus top-myynnissä — esim. "olet top 15 %:ssa". RANK antaa sijoituksen, mutta prosenttiosuus vaatii eri funktion.

## Ratkaisu

**PERCENT_RANK()** ikkunafunktiona:

```sql
SELECT
  salesperson,
  sales,
  PERCENT_RANK() OVER (ORDER BY sales DESC) AS pct_rank
FROM sales_by_person;
```

`PERCENT_RANK()` palauttaa arvon 0–1: `(rank - 1) / (total_rows - 1)`. Pienempi arvo = korkeampi myynti (kun ORDER BY DESC).

Vaihtoehdot: **CUME_DIST()** (kumulatiivinen jakauma), **RANK()** / **DENSE_RANK()** absoluuttiseen sijoitukseen. Valitse funktio raportin määritelmän mukaan.

## Taustaa

Ikkunafunktioiden ranking-perhe (RANK, DENSE_RANK, PERCENT_RANK, CUME_DIST) ratkaisee eri "sijoitus"-kysymyksiä — älä sekoita niitä keskenään.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
