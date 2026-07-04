# Junior haluaa poistaa seq scanin pienestä lookup-taulusta (200 riviä). Neuvo?

## Tilanne

`EXPLAIN` näyttää `Seq Scan on countries` — 200 riviä. Junior ehdottaa `CREATE INDEX` ja `SET enable_seqscan = off` "optimoidakseen" lookup-kyselyn. Indeksi lisää ylläpitokustannusta INSERT/UPDATE:lle ilman mitattavaa hyötyä.

Tämä on yleinen oppimisvirhe: seq scan ei ole vihollinen.

## Ratkaisu

**Seq scan voi olla halvin pienelle taululle — indeksi ei aina kannata.**

Selitä planner-logiikka:

- 200 riviä = muutama data-sivu, yksi sequential read
- Indeksi = extra random I/O + ylläpito jokaisessa kirjoituksessa
- `enable_seqscan = off` on debug-työkalu, ei tuotanto-optimointi

Neuvo mittaamaan `EXPLAIN (ANALYZE, BUFFERS)` — execution time on todennäköisesti alle millisekunti. Optimoi vasta, jos taulu kasvaa tai kysely toistuu äärimmäisen usein *ja* mittaus näyttää ongelman.

## Taustaa

Hyvä mentoriopetus: lue suunnitelma, älä reagoi sanan "Seq Scan" näkemiseen. PostgreSQLin dokumentaatio kuvaa tätä tarkoituksellista valintaa.

[Lue lisää](https://www.postgresql.org/docs/current/using-explain.html)
