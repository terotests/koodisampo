# EXPLAIN näyttää Seq Scan 5M rivin taulussa vaikka index on olemassa. Ensimmäinen tarkistus?

## Tilanne

5M rivin taulussa on indeksi WHERE-sarakkeelle. Silti suunnitelma on seq scan. Ensimmäinen reaktio on usein "indeksi rikki" tai "pakota index scan" — ennen selectivityn tarkistusta.

Planner valitsee seq scanin usein tarkoituksella, kun suuri osa riveistä täyttää ehdon.

## Ratkaisu

**Tarkista selectivity** — kuinka suuri osa taulusta palautuu?

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ... WHERE ...;
-- actual rows vs taulun kokonaisrivimäärä
SELECT reltuples FROM pg_class WHERE relname = 'your_table';
```

Jos `actual rows` on esim. >10–20 % `reltuples`:sta, seq scan voi olla halvempi. Jos selectivity on korkea (alle muutama %) ja silti seq scan:

1. `ANALYZE` — vanhentuneet stats
2. WHERE-ehto funktiossa ilman expression indexiä
3. `random_page_cost` / `effective_cache_size` vääristää costia

## Taustaa

Indeksin olemassaolo ei pakota sen käyttöä. Ensimmäinen tarkistus on aina "paljonko rivejä todella haetaan" — ei indeksin uudelleenrakennus.

[Lue lisää](https://www.postgresql.org/docs/current/sql-explain.html)
