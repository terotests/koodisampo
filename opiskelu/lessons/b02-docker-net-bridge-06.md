# Kaksi default-bridge containeria eivät resolvdu nimellä — miksi?

## Tilanne

Kaksi konttia ajetaan ilman erillistä verkkoa:

```bash
docker run -d --name web nginx:alpine
docker run -d --name api myapi:latest
```

Web-kontista:

```bash
docker exec web curl http://api:8080
curl: (6) Could not resolve host: api
```

Molemmat ovat " verkossa" oletuksena (`docker0` / default bridge), mutta hostname `api` ei resolvdu. Kehittäjä olettaa virheellisesti, että `--name` luo DNS-tietueen.

## Ratkaisu

**Default bridge ei resolvoi nimiä — käytä user-defined networkia.** User-defined bridge antaa DNS-nimet.

```bash
docker network create mynet
docker run -d --name web --network mynet nginx:alpine
docker run -d --name api --network mynet myapi:latest
docker exec web curl http://api:8080
```

Default bridge (`bridge`) on legacy-käyttäytyminen: kontit kommunikoivat IP:llä (link-local), mutta embedded DNS toimii vain user-defined bridge -verkoissa.

## Käytännössä

Älä käytä `--link` (deprecated). Compose-projektit luovat automaattisesti user-defined verkon — ongelma ilmenee usein `docker run` -testeissä ilman `--network`. Code review: kaikki palvelut samaan custom-verkkoon.

[Lue lisää](https://docs.docker.com/network/drivers/bridge/)
