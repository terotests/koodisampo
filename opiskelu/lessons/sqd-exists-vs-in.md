# Etsi asiakkaat joilla on vähintään yksi avoin tilaus. Mikä on usein tehokkain?

## Tilanne

Kampanjatiimi haluaa lähettää muistutuksen asiakkaille, joilla on avoin tilaus. Tarvitaan asiakaslista — ei tilausrivien yksityiskohtia.

Vaihtoehto A — IN-alikysely:

```sql
SELECT id, name, email
FROM customers
WHERE id IN (
  SELECT customer_id FROM orders WHERE status = 'open'
);
```

Vaihtoehto B — JOIN + DISTINCT:

```sql
SELECT DISTINCT c.id, c.name, c.email
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'open';
```

Molemmat tuottavat oikean joukon, mutta IN voi materialisoida koko alikyselyn ja JOIN moninkertaistaa asiakasrivit ennen DISTINCTiä.

## Ratkaisu

**`EXISTS` — semi-join, lopettaa ensimmäiseen matchiin:**

```sql
SELECT c.id, c.name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'open'
);
```

EXISTS on semi-join: PostgreSQL etsii vain yhden osuman per asiakas eikä tuota tilausrivejä ulompaan kyselyyn. Se on usein tehokkain "vähintään yksi match" -kyselyihin.

EXISTS lopettaa ensimmäiseen matchiin — ei laske kaikkia avoimia tilauksia.

## Käytännössä

Indeksi `orders (customer_id, status)` tai partial index `WHERE status = 'open'` nopeuttaa EXISTS-alikyselyä. Varmista `EXPLAIN`: SubPlan + Index Scan.

`IN (SELECT ...)` toimii usein samalla tavalla modernissa PostgreSQLissa (hash semi join), mutta EXISTS on selkeämpi ilmaisu semi-join -intentiolle code reviewssa.

Vältä `NOT IN` NULL-arvojen kanssa — käytä `NOT EXISTS` poissulkuun (ks. erillinen oppitunti).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
