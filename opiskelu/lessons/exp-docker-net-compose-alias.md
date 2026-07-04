# Compose-palvelu `api` ei löydä `cache`-palvelua hostnameilla. Mitä compose-network konfiguroit?

## Tilanne

`docker-compose.yml` määrittää Redis-cachen ja API:n:

```yaml
services:
  api:
    image: myapi:latest
    environment:
      REDIS_URL: redis://cache:6379
  cache:
    image: redis:7
```

API-logissa: `Error: getaddrinfo ENOTFOUND cache`. Molemmat kontit ovat käynnissä (`docker compose ps`), mutta DNS ei ratkaise palvelunimeä.

Usein syy on, että palvelut on liitetty eri verkkoihin tai custom-verkko on määritelty ilman, että molemmat palvelut liittyvät siihen.

## Ratkaisu

**Palvelut samassa compose user-defined verkossa näkevät toisensa.** Compose luo oletusverkon — palvelunimi on DNS-nimi verkossa.

Eksplisiittinen verkko (suositus moniverkko-setupissa):

```yaml
services:
  api:
    image: myapi:latest
    networks:
      - backend
    environment:
      REDIS_URL: redis://cache:6379
  cache:
    image: redis:7
    networks:
      - backend

networks:
  backend:
```

Oletusasetuksilla (ei `networks:`-osiota) Compose luo projektikohtaisen verkon ja kaikki palvelut liittyvät siihen automaattisesti — hostname `cache` toimii.

## Käytännössä

Projektin nimi vaikuttaa verkon nimeen (`projekti_default`), mutta ei DNS-nimiin palveluiden välillä. Code reviewissa tarkista, ettei joku palvelu ole `network_mode: host` tai eristetyssä verkossa ilman proxy-yhteyttä.

[Lue lisää](https://docs.docker.com/compose/networking/)
