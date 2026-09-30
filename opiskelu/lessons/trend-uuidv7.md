# PostgreSQL 18 toi uuidv7()-funktion. Miksi UUIDv7 on B-tree-pääavaimena parempi kuin satunnainen UUIDv4?

## Ratkaisu

RFC 9562 (2024) määritteli UUIDv7:n: 48 bittiä Unix-millisekunteja + satunnaisuutta. Satunnainen v4 osuu indeksissä minne sattuu, jolloin kuuma työjoukko on koko indeksi. v7 käyttäytyy lisäyksissä lähes kuin bigserial, mutta avaimia voi silti luoda hajautetusti.

## Käytännössä

Huomaa, että v7 paljastaa luontiajan. Jos se on arkaluontoista (esim. käyttäjätilin luontihetki julkisessa URL:ssa), harkitse erillistä julkista tunnistetta.


[Lue lisää](https://www.postgresql.org/docs/current/functions-uuid.html)
