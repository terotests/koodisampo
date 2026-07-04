# Geo-query: `WHERE location && box` — btree ei toimi. Indeksityyppi?

## Tilanne

PostGIS tai geometriakysely:

```sql
SELECT * FROM places WHERE location && 'BOX(0 0, 10 10)'::box;
```

B-tree-indeksi `(location)` ei tue overlap-operaattoria `&&`. Seq scan kaikilla paikoilla ei skaalaudu kartta-API:ssa.

Geometriset operaattorit vaativat erikoisindeksin.

## Ratkaisu

**GiST** (tai SP-GiST riippuen datasta ja operaattoreista):

```sql
CREATE INDEX ON places USING GIST (location);
```

GiST tukee overlap, contains, distance-operaattoreita. PostGIS:ssä `USING GIST (geom)` on standardi. SP-GiST vaihtoehto tietyille piste-/aluedatatyypeille.

B-tree toimii vain skalaarisille vertailuoperaattoreille (`=`, `<`), ei geometriselle overlapille.

## Taustaa

Indeksityypin valinta seuraa operaattoriluokasta — `EXPLAIN` kertoo, jos indeksi ja WHERE eivät täsmää. GiST on yleisin spatial-indeksi PostgreSQL-ekosysteemissä.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-types.html)
