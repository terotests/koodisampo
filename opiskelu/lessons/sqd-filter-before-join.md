# Liität `orders` (50M riviä) ja `customers` (2M). Tarvitset vain viime kuun tilaukset. Missä suodatus?

## Tilanne

Myyntiraportti yhdistää tilaukset ja asiakkaat. `orders`-taulu sisältää viiden vuoden historian — noin 50 miljoonaa riviä. `customers`-taulussa on kaksi miljoonaa riviä. Liiketoimintavaatimus on selkeä: vain kuluvan kuukauden tilaukset alueittain.

Kysymys kuuluu: pitääkö suodatus kirjoittaa erilliseen alikyselyyn ennen JOINia, vai riittääkö `WHERE`-ehto?

Huono tapa on hakea kaikki tilaukset sovellukseen tai rajata rivit vasta aggregoinnin jälkeen (esim. `HAVING`-ehdolla) — silloin miljoonia turhia rivejä kulkee joinin ja ryhmittelyn läpi.

## Ratkaisu

**Rajaa `orders` suoraan `WHERE`-ehdolla — planner soveltaa ehdon ennen joinia:**

```sql
SELECT c.region, count(*)
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.created_at >= date_trunc('month', CURRENT_DATE)
  AND o.created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
GROUP BY c.region;
```

PostgreSQLin planner työntää yhtä taulua koskevan `WHERE`-ehdon (predicate pushdown) inner joinin alle: `orders` suodatetaan ensin, ja `created_at`-indeksi rajaa joukon heti. Ehdon kirjoittaminen alikyselyyn ei siis nopeuta kyselyä — tärkeintä on, että rajaus on kannassa ja kohdistuu `orders`-tauluun.

Jos haluat erottaa vaiheet luettavuuden vuoksi, CTE toimii samoin (PostgreSQL 12+ yhdistää sen pääkyselyyn):

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

Early filtering pienentää joinin syötettä — mitä vähemmän rivejä liitetään, sitä vähemmän muistia, I/O:ta ja CPU:ta kuluu.

## Käytännössä

Varmista `EXPLAIN (ANALYZE, BUFFERS)`-tulosteella, että aikasuodatin käyttää indeksiä `created_at`-sarakkeella ennen joinia. Jos suunnitelma näyttää seq scan + hash join koko `orders`-taululle, tarkista indeksin olemassaolo ja tilastot (`ANALYZE orders`).

Raporttikyselyissä erota aina "rajaus liiketoimintalogiikkaan" omaksi CTE-vaiheeksi — se helpottaa testausta (`SELECT count(*) FROM recent_orders`) ja code reviewta.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
