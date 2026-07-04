# Tarvitset vain tiedon: onko asiakkaalla avoin tilaus. Tehokkain ilmaisu?

## Tilanne

Asiakaspalvelun näkymässä näytetään merkki "avoin tilaus" asiakkaan nimen vieressä. Tarvitaan vain totuusarvo — ei tilauslistaa, ei rivimäärää.

Kehittäjä kirjoittaa:

```sql
SELECT c.id, c.name,
       (SELECT count(*) FROM orders o
        WHERE o.customer_id = c.id AND o.status = 'open') > 0 AS has_open
FROM customers c;
```

Tai vielä raskaammin:

```sql
SELECT c.id, count(o.id) AS open_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'open'
GROUP BY c.id
HAVING count(o.id) > 0;
```

Molemmat laskevat kaikki avoimet tilaukset, vaikka riittäisi yksi osuma. Asiakkaalla sadalla avoimella rivillä kysely tekee turhaa työtä.

## Ratkaisu

**`EXISTS` — lopettaa ensimmäiseen osumaan:**

```sql
SELECT c.id, c.name,
       EXISTS (
         SELECT 1
         FROM orders o
         WHERE o.customer_id = c.id
           AND o.status = 'open'
       ) AS has_open_order
FROM customers c;
```

`EXISTS` on semi-join: PostgreSQL lopettaa alikyselyn heti kun yksi rivi täyttää ehdon. Se ei laske kaikkia rivejä kuten `count(*)`. `SELECT 1` alikyselyssä on konventio — sisältö ei merkitse, vain olemassaolo.

## Käytännössä

Indeksi `(customer_id, status)` tai `(customer_id) WHERE status = 'open'` (partial index) nopeuttaa EXISTS-kyselyä merkittävästi. Varmista `EXPLAIN`-tulosteella `Index Scan` + `SubPlan` early exit.

Kun tarvitset vain boolean-tiedon ("onko?", "löytyykö?"), EXISTS on oletusvalinta. COUNT on oikea vain kun numero itsessään on liiketoimintatieto ("montako avointa?").

API-kerroksessa vältä N+1: älä kutsu EXISTS-kyselyä jokaiselle asiakkaalle erikseen — käytä yhtä JOIN/EXISTS-kyselyä tai batch-latausta.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
