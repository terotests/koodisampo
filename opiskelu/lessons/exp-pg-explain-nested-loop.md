# JOIN palauttaa miljoona riviä — plan näyttää Nested Loop ja seq scan isolla taululla. Ensimmäinen epäily?

## Tilanne

Raportti joinaa kaksi isoa taulua ja palauttaa miljoona riviä. `EXPLAIN` näyttää:

```
Nested Loop
  -> Seq Scan on large_table
  -> ...
```

Cost ja execution time ovat astronomisia. Ensimmäinen epäily kohdistuu usein planneriin — mutta yleisin juurisyy on yksinkertaisempi.

## Ratkaisu

**Puuttuva indeksi join- tai WHERE-sarakkeella** — planner valitsi huonon polun, koska sisäpuoli joutuu seq scannaamaan ison taulun jokaisella ulkokehän iteroinnilla tai join-järjestys on väärä ilman statsia.

Tarkista:

```sql
-- Onko indeksi join-avaimessa?
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'large_table';

ANALYZE large_table, other_table;
EXPLAIN (ANALYZE, BUFFERS) ...;
```

Lisää indeksi join-sarakkeeseen ja mittaa uudelleen. Hash/merge join voi seurata automaattisesti, kun cost-malli saa oikeat tiedot.

## Taustaa

Miljoona palautettua riviä ei itsessään ole virhe — mutta nested loop + seq scan isolla taululla on lähes aina merkki puuttuvasta indeksistä tai vanhentuneista tilastoista.

[Lue lisää](https://www.postgresql.org/docs/current/performance-tips.html)
