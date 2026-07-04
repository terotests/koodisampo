# Kaksi konttia samassa user-defined bridge -verkossa. Miten `app` löytää `db`:n nimellä?

## Tilanne

Rakennat paikallisen kehitysympäristön, jossa web-sovellus ja PostgreSQL pyörivät erillisissä konteissa. Molemmat liitetään samaan verkkoon:

```bash
docker network create appnet
docker run -d --name db --network appnet postgres:16
docker run -d --name app --network appnet myapp:latest
```

Sovelluksen ympäristömuuttuja `DATABASE_URL=postgres://user:pass@db:5432/mydb` näyttää järkevältä, mutta kehittäjä yrittää ensin IP-osoitetta tai `localhost` — ne eivät toimi kontista toiseen. Ongelma on palvelun löydettävyydessä, ei itse tietokannassa.

User-defined bridge -verkossa Docker tarjoaa sisäänrakennetun DNS-resolverin. Konttien nimet (`db`, `app`) toimivat hostnameina samassa verkossa ilman manuaalista `/etc/hosts`-kirjoitusta.

## Ratkaisu

**Embedded DNS resolver** yhdistää palvelunimet verkossa oleviin kontteihin. User-defined bridge tarjoaa automaattisen DNS:n konttien välillä.

Varmista, että molemmat kontit ovat samassa verkossa:

```bash
docker network connect appnet db   # jos ei jo liitetty
docker network connect appnet app
```

Testaa DNS kontista:

```bash
docker exec app getent hosts db
docker exec app nslookup db
```

Compose:ssa palvelunimi on DNS-nimi oletusverkossa:

```yaml
services:
  db:
    image: postgres:16
  app:
    image: myapp:latest
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
```

## Käytännössä

Älä luota oletusbridge-verkkoon (`docker0`) — se ei tarjoa nimipohjaista DNS:ää. Tuotantoon Compose- tai orchestrator-verkossa dokumentoi palvelunimet ja käytä healthcheck + retry, koska DNS toimii heti kun kontti on verkossa, mutta palvelu voi olla vielä käynnistymässä.

[Lue lisää](https://docs.docker.com/network/drivers/bridge/)
