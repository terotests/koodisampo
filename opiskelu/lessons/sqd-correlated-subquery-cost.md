# Correlated subquery jokaiselle riville on hidas. Ensimmäinen refaktorointi?

## Tilanne

Raportti näyttää jokaiselle tilaukselle asiakkaan viimeisimmän tilauksen summan vertailua varten:

```sql
SELECT o.order_id, o.total,
       (SELECT max(o2.total)
        FROM orders o2
        WHERE o2.customer_id = o.customer_id) AS customer_max
FROM orders o
WHERE o.created_at >= CURRENT_DATE - interval '30 days';
```

Alikysely suoritetaan correlated-moodissa — käytännössä kerran per ulompi rivi. 100 000 tilauksella = 100 000 alikyselyä. Tuotannossa kysely kestää minuutteja ja `pg_stat_activity` näyttää saman kyselyn aktiivisena.

## Ratkaisu

**Korvaa JOIN, ikkunafunktio tai EXISTS — vertaa EXPLAINilla:**

Ikkunafunktio (usein paras tähän tapaukseen):

```sql
SELECT order_id, total, customer_max
FROM (
  SELECT o.order_id, o.total,
         max(o.total) OVER (PARTITION BY o.customer_id) AS customer_max
  FROM orders o
  WHERE o.created_at >= CURRENT_DATE - interval '30 days'
) sub;
```

Tai JOIN aggregaattiin:

```sql
SELECT o.order_id, o.total, agg.customer_max
FROM orders o
JOIN (
  SELECT customer_id, max(total) AS customer_max
  FROM orders
  GROUP BY customer_id
) agg ON agg.customer_id = o.customer_id
WHERE o.created_at >= CURRENT_DATE - interval '30 days';
```

Query design: korvaa correlated subquery joinilla tai ikkunalla. Ensimmäinen refaktorointi on valita oikea kuvio ja mitata EXPLAIN (ANALYZE, BUFFERS) ennen/jälkeen.

## Käytännössä

Correlated subquery on luettava mutta skaalautuu huonosti. Sääntö: jos alikysely viittaa ulomman rivin sarakkeeseen (`o.customer_id`), harkitse heti JOIN/window.

PostgreSQL 12+ voi joskus "de-correlate" alikyselyn automaattisesti — älä luota siihen; kirjoita eksplisiittinen JOIN.

Tallenna molemmat suunnitelmat PR:ään. `SubPlan` EXPLAINissa on merkki correlated subquerystä — tavoite on Hash Join tai WindowAgg.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
