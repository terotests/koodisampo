# API hidastuu ruuhkassa, mutta CPU on vain 30 %. Mitä tarkistat?

## Tilanne

Käyttäjämäärä kasvaa kampanjan aikana. CPU ei ole täynnä, mutta requestit jonoutuvat ja p95-latenssi kasvaa. Lokissa näkyy odotusta tietokantayhteyden saamisessa: `timeout waiting for connection from pool`.

N+1-kyselyt ja connection poolin tyhjeneminen ovat yleisiä syitä. CPU 30 % ei tarkoita, että palvelimella on kapasiteettia — pullonkaula voi olla muualla.

## Ratkaisu

**Saturation: DB connection pool, thread pool, jonot, lockit ja hitaat queryt.**

Pullonkaula ei aina ole CPU. Tarkista saturation:

- DB connection pool käytössä / odotusaika
- thread/worker pool
- jonojen pituudet
- ulkoisten API-kutsujen määrä
- hitaat queryt
- lockit tietokannassa

Connection poolia ei pidä vain kasvattaa sokkona. Liian suuri pooli voi kaataa tietokannan. Ensin selvitä, miksi yhteydet ovat pitkään varattuina: hitaat queryt, N+1, puuttuvat indeksit, pitkät transaktiot tai riippuvuuskutsut transaktion sisällä.

## Käytännössä

Mittaa poolin `active`, `idle` ja `waiting` -luvut. Tarkista `pg_stat_activity` pitkään käynnissä olevista kyselyistä. Jos yhteydet vapautuvat hitaasti, korjaa queryt ennen poolin kasvattamista. PgBouncer voi auttaa, mutta se ei korvaa huonoa query-suunnittelua.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-connection.html)
