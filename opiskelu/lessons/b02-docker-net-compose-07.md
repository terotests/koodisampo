# Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy?

## Tilanne

`docker-compose.yml`:

```yaml
services:
  web:
    image: myweb:latest
    environment:
      DATABASE_HOST: db
  db:
    image: postgres:16
networks:
  frontend:
  backend:

# web liitetty vain frontend-verkkoon
```

Web-logissa: `connection refused` tai `could not translate host name "db"`. Molemmat palvelut ovat samassa Compose-projektissa, mutta DNS ei toimi odotetusti.

## Ratkaisu

**Palvelut eri verkossa tai väärä service name — tarkista networks.** Compose network luo DNS service-nimille samassa verkossa.

Korjaus — molemmat samaan verkkoon:

```yaml
services:
  web:
    image: myweb:latest
    networks:
      - backend
    environment:
      DATABASE_HOST: db
  db:
    image: postgres:16
    networks:
      - backend

networks:
  backend:
```

Varmista myös, että hostname vastaa palvelun nimeä (`db`, ei `database` ellei aliasta ole määritelty).

## Käytännössä

Moniverkko-arkkitehtuurissa (frontend + backend erillään) tietokanta kuuluu vain backend-verkkoon — web tavoittaa db:n vain API:n kautta, ei suoraan. Dokumentoi verkkotopologia diagrammina, jotta `networks:`-virheet eivät päädy tuotantoon.

[Lue lisää](https://docs.docker.com/compose/how-tos/networking/)
