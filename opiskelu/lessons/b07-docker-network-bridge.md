# Kaksi konttia samassa custom networkissä — toinen ei tavoita toista hostname:llä. Mikä on oikea DNS-nimi?

## Tilanne

```bash
docker network create mynet
docker run -d --name postgres-db --network mynet postgres:16
docker run -d --name my-app --network mynet myapp:latest
```

Sovellus konfiguroitu: `DB_HOST=postgres`. Yhteys epäonnistuu — väärä hostname. Kehittäjä arvasi nimen, mutta Docker DNS käyttää kontin **nimeä** (`--name` tai Compose-palvelun nimeä), ei satunnaista aliasia.

```bash
docker exec my-app getent hosts postgres
# (tyhjä)
docker exec my-app getent hosts postgres-db
# 172.18.0.2 postgres-db
```

## Ratkaisu

**Käytä toisen kontin service/container-nimeä user-defined networkin DNS:ssä.** Embedded DNS resolves container names.

Korjaa konfiguraatio:

```bash
docker run -d --name my-app --network mynet \
  -e DB_HOST=postgres-db \
  myapp:latest
```

Compose:ssa palvelun avain on DNS-nimi:

```yaml
services:
  postgres-db:
    image: postgres:16
  my-app:
    image: myapp:latest
    environment:
      DB_HOST: postgres-db
```

## Käytännössä

DNS-nimi on case-sensitive Linuxissa. Dokumentoi palvelunimet compose-tiedostossa — ne ovat osa API-sopimusta. Jos nimi pitää olla lyhyt (`db`), nimeä palvelu suoraan `db`:ksi tai käytä `network_aliases`.

[Lue lisää](https://docs.docker.com/engine/network/)
