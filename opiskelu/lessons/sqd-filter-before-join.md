# Liität `orders` (50M riviä) ja `customers` (2M). Tarvitset vain viime kuun tilaukset. Missä suodatus?

## Tilanne

Myyntiraportti yhdistää tilaukset ja asiakkaat. `orders`-taulu sisältää viiden vuoden historian — noin 50 miljoonaa riviä. `customers`-taulussa on kaksi miljoonaa riviä. Liiketoimintavaatimus on selkeä: vain kuluvan kuukauden tilaukset alueittain.

Huono tapa on liittää ensin kaikki ja suodattaa vasta lopussa:

```sql
SELECT c.region, count(*)
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY c.region;
```

PostgreSQL saattaa onneksi työntää `WHERE`-ehdon joinin alle, mutta luettava koodi ja eksplisiittinen early filtering varmistavat, ettei optimoija joudu arvailemaan. Väärässä järjestyksessä kirjoitettu kysely voi aiheuttaa väliaikaisesti miljoonien rivien hash joinin.

## Ratkaisu

**Suodata `orders` aikarajalla ennen JOINia — pienennä joukkoa mahdollisimman aikaisin:**

```sql
SELECT c.region, count(*)
FROM (
  SELECT customer_id
  FROM orders
  WHERE created_at >= date_trunc('month', CURRENT_DATE)
    AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
) o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.region;
```

Tai CTE:llä luettavammin:

```sql
WITH recent_orders AS (
  SELECT customer_id
  FROM orders
  WHERE created_at >= date_trunc('month', CURRENT_DATE)
    AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
)
SELECT c.region, count(*)
FROM recent_orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.region;
```

Early filtering pienentää joinin syötettä — query design -best practice. Mitä vähemmän rivejä liitetään, sitä vähemmän muistia, I/O:ta ja CPU:a kuluu.

## Käytännössä

Varmista `EXPLAIN (ANALYZE, BUFFERS)`-tulosteella, että aikasuodatin käyttää indeksiä `created_at`-sarakkeella ennen joinia. Jos suunnitelma näyttää seq scan + hash join koko `orders`-taululle, tarkista indeksin olemassaolo ja tilastot (`ANALYZE orders`).

Raporttikyselyissä erota aina "rajaus liiketoimintalogiikkaan" omaksi CTE-vaiheeksi — se helpottaa testausta (`SELECT count(*) FROM recent_orders`) ja code reviewta.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
