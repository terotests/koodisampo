# Planner valitsee seq scan — rows estimate 10 mutta actual 10M. Juurisyy?

## Tilanne

`EXPLAIN ANALYZE` paljastaa katastrofaalisen arvio-eron: planner luulee 10 riviä, todellisuudessa 10 miljoonaa. Se valitsee nested loopin tai pienen hash-taulun — suunnitelma romahtaa. Indeksi voi olla olemassa, mutta planner "ei tiedä" sen hyödyllisyyttä.

Tämä on klassinen **tilasto-ongelma**, ei seq scan -preferenssi itsessään.

## Ratkaisu

**Vanhentuneet tilastot** bulk loadin, massa-INSERT:in tai pitkään ajamattoman ANALYZE:n jälkeen. Ensimmäinen toimenpide:

```sql
ANALYZE affected_table;
```

Jos yksiarvoiset tilastot eivät riitä (korreloituneet sarakkeet, epätasainen jakauma), harkitse **extended statistics**:

```sql
CREATE STATISTICS stats_dep (dependencies) ON col_a, col_b FROM t;
ANALYZE t;
```

Vasta päivitettyjen statsien jälkeen arvioi `EXPLAIN (ANALYZE, BUFFERS)` uudelleen. Juurisyy on lähes aina stats, ei "bugi seq scanissa".

## Taustaa

Planner ei lue taulua ennen suunnitelmaa — se luottaa `pg_stats`-metadataan. 10 vs 10M -virhe tarkoittaa, että metadata on käytännössä väärä.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-STATISTICS)
