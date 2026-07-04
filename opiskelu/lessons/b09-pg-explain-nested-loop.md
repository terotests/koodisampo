# JOIN 100k × 100k riviä — Nested Loop cost 10^9. Mitä plannerin pitäisi valita?

## Tilanne

Kaksi keskikokoista taulua (100k × 100k) joinataan ilman sopivia indeksejä tai tilastoja. `EXPLAIN` näyttää `Nested Loop` cost 10^9 — käytännössä suorittamaton tuotannossa. Planner on valinnut väärän join-algoritmin suhteessa dataan.

Isoille tasaisille dataseteille nested loop ilman indeksiä on lähes aina väärin.

## Ratkaisu

Plannerin **pitäisi valita Hash Join tai Merge Join**:

- **Hash Join** — kun toinen puoli mahtuu hash-tauluun (`work_mem`) tai spill hyväksytään
- **Merge Join** — kun join-avaimet ovat indeksoituja ja data järjestyksessä

Tarkista:

```sql
ANALYZE table_a, table_b;
EXPLAIN (ANALYZE, BUFFERS) SELECT ... JOIN ...;
```

Puuttuvat indeksit join-sarakkeissa ja vanhentuneet stats estävät hyvän valinnan. Korjaa stats + indeksit ennen join-algoritmin pakottamista.

## Taustaa

Cost 10^9 on plannerin tapa sanoa "tämä on erittäin kallis". Juurisyy on lähes aina puuttuva indeksi/stats isoille join:eille — ei nested loop "bugi".

[Lue lisää](https://www.postgresql.org/docs/current/planner-optimizer.html)
