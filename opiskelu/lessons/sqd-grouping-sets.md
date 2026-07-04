# Tarvitset summat alueittain, tuoteperheittäin ja grand totalin yhdellä kyselyllä.

## Tilanne

Johdon raportti vaatii kolme aggregaatiotasoa samasta myyntidatasta:

1. Summa per `region` (esim. Pohjoinen, Etelä)
2. Summa per `product_family` (esim. Elektroniikka, Vaatteet)
3. Grand total koko yritykselle

Ilman `GROUPING SETS`:ia kehittäjä kirjoittaa kolme erillistä kyselyä ja yhdistää ne `UNION ALL`:lla:

```sql
SELECT region, NULL AS product_family, sum(amount) FROM sales GROUP BY region
UNION ALL
SELECT NULL, product_family, sum(amount) FROM sales GROUP BY product_family
UNION ALL
SELECT NULL, NULL, sum(amount) FROM sales;
```

Toimii, mutta skannaa `sales`-taulun kolme kertaa ja duplikoi logiikkaa.

## Ratkaisu

**`GROUP BY GROUPING SETS` — määrittelee tarkat aggregaatiotasot yhdellä kertaa:**

```sql
SELECT
  region,
  product_family,
  sum(amount) AS total,
  grouping(region, product_family) AS grouping_flags
FROM sales
GROUP BY GROUPING SETS (
  (region),
  (product_family),
  ()
);
```

Yksi tauluskannaus, kolme aggregaatiotasoa. `grouping()`-funktio kertoo, kumpi sarake on "rollup-taso" (NULL tarkoittaa aggregaatiotasoa, ei puuttuvaa dataa).

GROUPING SETS määrittelee tarkat aggregaatiotasot — tehokkaampi kuin usea erillinen kysely.

## Käytännössä

`ROLLUP` ja `CUBE` ovat erikoistapauksia GROUPING SETS:stä. Käytä GROUPING SETS, kun tarvitset vain tiettyjä tasoja — ei kaikkia osajoukkoja.

Tuloksissa NULL voi tarkoittaa joko "ei arvoa tässä ryhmässä" tai "rollup-taso". Erottele `GROUPING(sarake) = 1` raportin muotoilussa.

Suurissa tauluissa yksi skannaus säästää I/O:ta merkittävästi verrattuna kolmeen UNION-kyselyyn. Varmista indeksit `(region)` ja `(product_family)` tarvittaessa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
