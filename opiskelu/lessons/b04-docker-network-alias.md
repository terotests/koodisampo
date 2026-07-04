# Kontti A ei löydä kontti B:tä nimellä `api` samassa user-defined networkissä. Compose-ratkaisu?

## Tilanne

```yaml
services:
  frontend:
    image: myfrontend:latest
    environment:
      API_URL: http://api:3000
  backend:
    image: mybackend:latest
    container_name: my-backend-container
```

Frontend ei löydä `api`-hostnamea, vaikka molemmat ovat samassa projektissa. Kehittäjä olettaa, että `container_name` määrittää DNS-nimen — se ei ole Compose-DNS-nimi.

## Ratkaisu

**Palvelun nimi compose:ssa on DNS-nimi — network: shared + service name api.** User-defined bridge tekee DNS:n palvelunimille.

Nimeä backend-palvelu uudelleen tai käytä aliasta:

```yaml
services:
  frontend:
    image: myfrontend:latest
    networks:
      - appnet
    environment:
      API_URL: http://api:3000
  api:
    image: mybackend:latest
    networks:
      - appnet

networks:
  appnet:
```

Tai alias vanhalle nimelle:

```yaml
  backend:
    image: mybackend:latest
    networks:
      appnet:
        aliases:
          - api
```

## Käytännössä

DNS-nimi = Compose-palvelun avain (`services:`-osion nimi), ei `container_name`. Tuotannossa pidä palvelunimet stabiileina — ne ovat konfiguraatio-API muiden palveluiden kannalta. Refaktoroi nimi aliasin kautta, älä katkaise DNS:ää kerralla.

[Lue lisää](https://docs.docker.com/engine/network/)
