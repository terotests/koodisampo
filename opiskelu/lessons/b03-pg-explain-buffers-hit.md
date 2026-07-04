# EXPLAIN ANALYZE näyttää hitaudesta — haluat tietää cache hit vs disk read. Lippu?

## Tilanne

`EXPLAIN ANALYZE` kertoo, kuinka kauan kysely kesti ja montako riviä jokainen solmu palautti. Se ei kuitenkaan erottele, oliko hidastus levyltä lukemisesta vai muistista — execution time voi olla korkea sekä cold cache -tilanteessa että CPU-raskaassa laskennassa.

Tuotantotroubleshootingissa tarvitset tietää: lukeeko kysely dataa levyltä (`shared read`) vai osuuuko se PostgreSQLin `shared_buffers`-cacheen ja OS page cacheen (`shared hit`). Ilman tätä saatat nostaa turhaan `work_mem`-arvoa, kun ongelma on puuttuva indeksi ja satunnainen I/O.

## Ratkaisu

Lisää **BUFFERS**-lippu EXPLAIN-komentoon:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Tulosteessa jokaisella solmulla näkyy esim. `Buffers: shared hit=12000 read=450`. `hit` = blokkia luettiin cachesta; `read` = blokkia haettiin levyltä. Korkea `read`-osuus viittaa I/O-pullonkaulaan tai kylmään cacheen.

`BUFFERS` toimii yhdessä `ANALYZE`-lipun kanssa — pelkkä `EXPLAIN BUFFERS` arvioi vain, mutta ei suorita kyselyä eikä näytä todellisia hit/read-lukuja suorituksen jälkeen.

## Tulkinta

Vertaa `shared hit` vs `shared read` suhteessa execution timeen. Jos `read` on suuri mutta `hit` pieni, ensimmäinen ajokerta kylmällä cachella on odotettavasti hidas — toista mittaus warm cachella. Jos `read` pysyy korkeana toistuvissa ajoissa, indeksi, selectivity tai `effective_cache_size` kannattaa tarkistaa.

`local` ja `temp` viittaavat istuntokohtaiseen muistiin ja temp-tiedostoihin (sort/hash spill). Ne kertovat erillisestä ongelmasta kuin shared buffer -I/O.

[Lue lisää](https://www.postgresql.org/docs/current/using-explain.html)
