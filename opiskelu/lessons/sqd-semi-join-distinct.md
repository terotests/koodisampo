# Tarvitset asiakkaat joilla on tilaus — ei tarvitse tilausrivejä. Vältä?

## Tilanne

Kampanjalistalle tarvitaan asiakkaat, joilla on vähintään yksi tilaus viime vuodelta. Tulos: yksi rivi per asiakas — tilausten määrä tai yksityiskohdat eivät kiinnosta.

Kehittäjä kirjoittaa:

```sql
SELECT DISTINCT c.id, c.name, c.email, c.region
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2025-01-01';
```

JOIN tuottaa yhden rivin jokaista tilausta kohti — asiakas viidellä tilauksella tulee viidesti. `DISTINCT` poistaa duplikaatit, mutta join on jo tehnyt turhan työn: hash/sort deduplikointiin miljoonalla tilausrivillä.

## Ratkaisu

**Semi-join — älä moninkertaista rivejä turhaan; käytä EXISTS tai DISTINCT vain tarvittaessa:**

```sql
SELECT c.id, c.name, c.email, c.region
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.created_at >= '2025-01-01'
);
```

Semi-join palauttaa asiakasrivit ilman tilausrivejä. EXISTS lopettaa ensimmäiseen osumaan — ei deduplikointia, ei DISTINCTiä.

Vaihtoehto: `SELECT DISTINCT c.id, ...` on ok pienissä joukoissa, mutta EXISTS on oikea kuvio "asiakkaat joilla on X".

Semi-join: älä moninkertaista rivejä turhaan.

## Käytännössä

Kysy aina: "Tarvitsenko oikean puolen sarakkeita SELECT-listaan?" Jos ei → EXISTS/IN semi-join, ei JOIN.

`EXPLAIN ANALYZE` näyttää JOIN+DISTINCT -polulla ylimääräisen HashAggregate-vaiheen, jota EXISTS välttää.

API-vastauksissa semi-join estää myös vahingossa vuotaneet tilaustiedot, kun tarvitaan vain asiakaslista.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
