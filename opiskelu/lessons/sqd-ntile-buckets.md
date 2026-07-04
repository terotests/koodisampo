# Jaa asiakkaat neljään kvartiiliin liikevaihdon mukaan. Funktio?

## Tilanne

Myyntijohto haluaa segmentoida asiakkaat neljään yhtäsuuruiseen ryhmään (kvartiilit) liikevaihdon mukaan — Q1 alhaisimmat, Q4 korkeimmat. Tasajako riveihin, ei arvoalueisiin.

CASE-lausekkeet manuaalisesti percentile-arvoilla ovat hankalia ja virhealttiita.

## Ratkaisu

**NTILE(4)** ikkunafunktiona:

```sql
SELECT
  customer_id,
  revenue,
  NTILE(4) OVER (ORDER BY revenue DESC) AS quartile
FROM customer_revenue;
```

`NTILE(n)` jakaa rivit n yhtäsuuruiseen bucketiin järjestyksessä. `ORDER BY revenue DESC` — quartile 1 = korkein liikevaihto (tai käännä ASC halutun konvention mukaan).

Dokumentoi quartile-numerointi raportissa — DESC vs ASC sekoittaa usein.

## Taustaa

NTILE eroaa PERCENT_RANK:sta: NTILE jakaa rivit tasaisesti bucketeihin; PERCENT_RANK antaa suhteellisen sijoituksen 0–1.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
