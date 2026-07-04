# Nested Loop + Seq Scan sisäpuolella miljoona kertaa — tyypillinen fix?

## Tilanne

`EXPLAIN ANALYZE` näyttää:

```
Nested Loop
  -> Seq Scan on orders (1000 rows)
  -> Seq Scan on order_items (500000 rows)
        loops=1000
```

Sisäpuolen seq scan ajetaan ulkokehän jokaiselle riville — käytännössä O(n×m). Execution time kasvaa miljooniin millisekunteihin. `enable_nestloop=off` pakottaa toisen join-tyypin, mutta se on oireenhoitoa, ei juurisyyn korjausta.

## Ratkaisu

**Indeksi join- tai WHERE-sarakkeille** sisäpuolen taulussa, jotta nested loop käyttää `Index Scan` tai `Index Only Scan` jokaisella ulkokehän iteroinnilla:

```sql
CREATE INDEX ON order_items (order_id);
```

Vaihtoehtoisesti planner voi valita **Hash Join** tai **Merge Join**, jos tilastot ja muisti (`work_mem`) sallivat — mutta puuttuva indeksi on yleisin syy nested loop + seq scan -yhdistelmään.

Päivitä myös tilastot (`ANALYZE`), jos planner arvioi väärin ulkokehän koon ja valitsee huonon join-järjestyksen.

## Taustaa

Nested loop on oikein, kun ulkokehä on pieni ja sisäpuolella on indeksi. Ilman indeksiä sisäpuoli skannaa koko taulun joka kerta — klassinen N+1-tyyppinen katastrofi SQL-tasolla.

[Lue lisää](https://www.postgresql.org/docs/current/explicit-joins.html)
