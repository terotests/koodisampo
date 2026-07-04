# EXPLAIN näyttää Index Scan mutta ei Index Only Scan — mitä puuttuu usein?

## Tilanne

Covering-indeksi on olemassa — kaikki SELECT-sarakkeet ovat indeksissä. Silti suunnitelma on `Index Scan` ja jokaisella rivillä `Heap Fetches`. Odotit Index Only Scan -hyötyä (vähemmän I/O:ta), mutta planner tai suoritus pakottaa heap-käynnin.

## Ratkaisu

**Visibility map ei ole ajan tasalla** — yleisin syy. PostgreSQL voi ohittaa heap-vaiheen vain, jos visibility map vakuuttaa, että sivun kaikki rivit ovat näkyvissä. UPDATE-heavy taulussa autovacuum ei ehdi → map vanhenee → pakolliset heap fetchit.

Toinen yleinen syy: **indeksi ei kata kaikkia tarvittavia sarakkeita** (esim. SELECT listaa sarakkeen, jota ei ole INCLUDE:ssa).

Korjaus:

```sql
VACUUM ANALYZE table_name;
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Tarkista `Heap Fetches: 0` tai lähellä nollaa Index Only Scan -solmussa.

## Taustaa

Index Only Scan vaatii sekä oikean indeksin että ajantasaisen visibility mapin. Pelkkä covering-indeksi ilman VACUUM:ia ei riitä UPDATE-kuormassa.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
