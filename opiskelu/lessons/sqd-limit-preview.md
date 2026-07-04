# Kehität uutta analytiikkakyselyä tuotantataululle. Miten testaat turvallisesti?

## Tilanne

Data-analyytikko rakentaa uutta kyselyä, joka laskee asiakkaiden elinkaariarvon (LTV) viiden vuoden tilaushistoriasta. `orders`-taulu on tuotannossa, ja jokainen täysi skannaus kuormittaa levyn I/O:ta ja voi hidastaa muita palveluita.

Ensimmäinen luonnos näyttää houkuttelevalta:

```sql
SELECT customer_id,
       sum(total) AS ltv,
       count(*) AS order_count
FROM orders
GROUP BY customer_id
ORDER BY ltv DESC;
```

Kehitysympäristön kopiossa se ajaa sekunnissa. Tuotannossa sama kysely voi kestää minuutteja ja toistuvat testaukset (muokkaat GROUP BY -logiikkaa, liität uuden JOINin) kasaavat kuormaa nopeasti.

Turvallinen kehitystapa alkaa pienestä otoksesta, ei täydestä taulusta.

## Ratkaisu

**Käytä `LIMIT` ja `WHERE`-rajausta testauksessa — älä aja täyttä skannausta toistuvasti:**

```sql
SELECT customer_id,
       sum(total) AS ltv,
       count(*) AS order_count
FROM orders
WHERE created_at >= CURRENT_DATE - interval '90 days'
GROUP BY customer_id
ORDER BY ltv DESC
LIMIT 100;
```

Sama periaate kuin kirjan `TOP(3)`-esimerkissä: pienennä testijoukkoa, kunnes logiikka on oikein. Vasta sen jälkeen poista raja tai siirry staging-kantaan, jossa voit ajaa `EXPLAIN ANALYZE` ilman tuotantovaikutusta.

Voit myös testata yhdellä asiakkaalla:

```sql
WHERE customer_id = 12345
```

tai satunnaisotoksella `TABLESAMPLE BERNOULLI (0.1)` suurissa tauluissa.

## Käytännössä

Aseta tiimille sääntö: analytiikkakyselyt tuotantoon vain read replica -instanssille tai `statement_timeout`-rajauksella. Pidä testikyselyissä aina näkyvissä kommentti `-- DEV: limited sample`, jotta kukaan ei kopioi rajattua versiota suoraan yöajoon.

Kun logiikka toimii otoksella, vertaa tuloksia stagingissa täydellä datalla kerran — ei sadalla iteratiivisella ajolla tuotannossa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
