# JOIN palauttaa saman asiakkaan viidesti. Raportti tarvitsee yhden rivin per asiakas. Ensimmäinen korjaus?

## Tilanne

Asiakaslistaus liitetään tilauksiin raporttia varten:

```sql
SELECT c.customer_id, c.name, o.order_id
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id;
```

Asiakas, jolla on viisi tilausta, näkyy viidesti. Excel-exportissa rivimäärä on viisinkertainen odotettuun nähden, ja `COUNT(DISTINCT customer_id)` korjaa vain oireen aggregaatiossa — ei itse joinin tulosta.

Kehittäjä lisää nopeasti `SELECT DISTINCT c.customer_id, c.name`, mutta rivit voivat silti duplikoitua, jos `order_id` on mukana. Ongelman juuri on join, joka moninkertaistaa vasemman puolen rivit.

## Ratkaisu

**Tarkista join-ehto ja tarvittaessa deduplikoi tarkoituksella — `DISTINCT ON` tai ikkunafunktio:**

Ensin varmista, että join on oikea. Jos tarvitset vain yhden rivin per asiakas ilman tilaustietoja, semi-join on parempi:

```sql
SELECT c.customer_id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
);
```

Jos tarvitset yhden edustavan tilauksen per asiakas:

```sql
SELECT DISTINCT ON (c.customer_id)
       c.customer_id, c.name, o.order_id
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
ORDER BY c.customer_id, o.created_at DESC;
```

Deduplikointi on oire — korjaa join tai käytä tarkoitustaan vastaavaa kuviota (EXISTS, DISTINCT ON, `ROW_NUMBER()`). `DISTINCT` ilman tarkkaa sarjelistaa piilottaa ongelman mutta ei poista turhaa työtä join-vaiheessa.

## Käytännössä

Kun rivimäärä yllättää, laske ensin `count(*)` vs `count(DISTINCT customer_id)`. Ero kertoo duplikaatiosta. `EXPLAIN ANALYZE` näyttää, monenko rivin hash join tuottaa ennen DISTINCT-vaihetta.

Code reviewssa kysy aina: "Tarvitseeko raportti kaikki matchit vai yhden per avain?" Semi-join (`EXISTS`) on usein selkeämpi kuin `JOIN` + `DISTINCT`.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
