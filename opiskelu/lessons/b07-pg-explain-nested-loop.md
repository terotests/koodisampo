# Nested Loop cost 500000 — pieni taulu ison kanssa ilman indeksiä. Korjaus?

## Tilanne

`EXPLAIN` näyttää `Nested Loop` cost 500000: ulkokehä palauttaa 10 000 riviä pienestä taulusta, sisäpuoli skannaa 5M rivin taulun jokaisella iteroinnilla ilman indeksiä join-sarakkeessa. Cost on korkea, execution time tuotannossa katastrofaalinen.

Planner valitsi nested loopin, koska se arvioi ulkokehän pieneksi — mutta sisäpuolen puuttuva indeksi tekee siitä O(n×m).

## Ratkaisu

**Indeksi join-sarakkeeseen** sisäpuolen (tai molempien, riippuen join-järjestyksestä) taulussa:

```sql
CREATE INDEX ON line_items (order_id);
```

Indeksin jälkeen sisäpuoli muuttuu `Index Scan` tai `Bitmap Index Scan` -muotoon — nested loop cost putoaa dramaattisesti. Planner voi myös vaihtaa **Hash Join**iin, jos `work_mem` riittää ja tilastot tukevat.

Päivitä tilastot `ANALYZE`:lla, jos planner valitsee edelleen huonon join-järjestyksen.

## Taustaa

Nested loop + indeksi on usein optimaalinen pieni×iso -joinissa. Nested loop + seq scan sisäpuolella on lähes aina korjattava indeksillä.

[Lue lisää](https://www.postgresql.org/docs/current/performance-tips.html)
