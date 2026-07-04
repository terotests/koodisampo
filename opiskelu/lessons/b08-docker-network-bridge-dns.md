# Compose-palvelu `api` ei löydä `db`-hostnamea — oletusbridge-verkossa. Mikä pitää olla?

## Tilanne

Kehittäjä on poistanut Compose-verkon määrittelyn:

```yaml
services:
  api:
    image: myapi:latest
    network_mode: bridge   # tai oletusbridge
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
    network_mode: bridge
```

`api` ei resolvdu hostnamea `db`. Oletusbridge-verkossa Compose-palvelunimet eivät toimi DNS-niminä — toisin kuin user-defined verkossa.

## Ratkaisu

**Palvelut samassa user-defined networkissä — Compose luo DNS-nimet palveluille.** Embedded DNS on user-defined networks.

Poista `network_mode: bridge` ja käytä oletusverkkoa tai määrittele eksplisiittisesti:

```yaml
services:
  api:
    image: myapi:latest
    networks:
      - backend
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
    networks:
      - backend

networks:
  backend:
```

Compose luo `projekti_backend`-verkon automaattisesti; hostname `db` resolvduu `api`-kontista.

## Käytännössä

Älä käytä `network_mode: bridge` ilman erityistä syytä — se rikkoo Compose-DNS:n. Code review -checklist: kaikki palvelut user-defined verkossa, ei oletusbridgeä. Legacy-skriptit, jotka käyttävät `docker run` ilman `--network`, aiheuttavat saman ongelman.

[Lue lisää](https://docs.docker.com/engine/network/drivers/bridge/)
