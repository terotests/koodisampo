# EXPLAIN näyttää Hash Join kahden ison taulun välillä — muisti loppuu. Vaihtoehto?

## Tilanne

Kaksi 10M rivin taulua joinataan. Planner valitsee Hash Join, mutta hash-taulu spillaa levylle (`temp file`) tai muisti loppuu. Hash join on hyvä, kun hash mahtuu `work_mem`:iin — muuten suoritus romahtaa.

Vaihtoehto riippuu datan muodosta ja indekseistä.

## Ratkaisu

**Jos toinen taulu on pieni ja join-sarakkeessa on indeksi**, planner voi valita **Nested Loop + Index Scan** — O(n × log m) pienellä ulkokehällä. Pakota tutkimus:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
-- vertaa Hash Join vs Nested Loop cost-arvioita ANALYZE:n jälkeen
```

**Jos molemmat taulut isoja**, vaihtoehdot:

- Nosta **`work_mem`** istuntokohtaisesti, jos hash mahtuu muistiiin ilman OOM-riskiä
- **Merge Join** järjestetyillä indekseillä, jos join-avaimet ovat indeksoituja
- Muuta kyselyä (esim. pre-aggregate, väliaikainen taulu)

`enable_hashjoin=off` on viimeinen keino debuggausta varten — älä jätä tuotantoon.

## Taustaa

Hash join rakentaa hash-taulun pienemmästä sivusta muistiin. Kaksi isoa puolta → spill tai vaihto merge/nested -strategiaan, jos indeksit sallivat.

[Lue lisää](https://www.postgresql.org/docs/current/explicit-joins.html)
