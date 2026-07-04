# Kysely hidastui release:n jälkeen. Ensimmäinen askel ennen GUC-säätöä?

## Tilanne

Deployn jälkeen tuotantoseuranta näyttää, että tilaushistorian listaus on hidastunut 200 ms:stä 8 sekuntiin. DevOps ehdottaa heti `work_mem`-arvon nostamista ja `random_page_cost`:in säätöä. DBA muistaa saman keskustelun viime kuusta — GUC-muutokset eivät auttaneet, koska ongelma oli väärä join-järjestys SQL:ssä.

Hidas kysely:

```sql
SELECT o.*, c.name, p.title
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN products p ON p.id = o.product_id
WHERE o.created_at >= CURRENT_DATE - interval '30 days'
ORDER BY o.created_at DESC
LIMIT 100;
```

Ilman suunnitelman ymmärtämistä konfiguraation säätö on arvaamista — ja voi pahentaa muiden kyselyiden suorituskykyä.

## Ratkaisu

**`EXPLAIN (ANALYZE, BUFFERS)` stagingissa — ymmärrä suunnitelma, sitten kirjoita tai korjaa SQL:**

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.*, c.name, p.title
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN products p ON p.id = o.product_id
WHERE o.created_at >= CURRENT_DATE - interval '30 days'
ORDER BY o.created_at DESC
LIMIT 100;
```

Query plan ennen konfiguraatiota — kirjan järjestys. Etsi suunnitelmasta: seq scan vs index scan, nested loop vs hash join, buffer hit/miss, rows estimate vs actual. Vasta kun tiedät *miksi* kysely on hidas (puuttuva indeksi, vanhentuneet tilastot, SELECT *, väärä join-järjestys), tee kohdennettu korjaus.

## Käytännössä

Aja EXPLAIN stagingissa tuotantovastaavalla datamäärällä — dev-kannan suunnitelma voi olla täysin eri. Käytä `EXPLAIN` ilman ANALYZE tuotannossa, jos kysely on liian raskas; ANALYZE vain maintenance-ikkunassa.

Älä nosta `work_mem` globaalisti "korjauksena" — se auttaa vain hash/sort -pullonkauloissa ja voi aiheuttaa muistiongelmia. Indeksi tai SQL-korjaus on usein pysyvämpi.

Tallenna ennen/jälkeen-suunnitelmat PR:ään regressioseurantaa varten. `pg_stat_statements` löytää hitaat patternit; EXPLAIN kertoo miksi.

[Lue lisää](https://www.postgresql.org/docs/current/sql-exexplain.html)
