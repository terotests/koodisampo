# Kontti pitää tavoittaa nimellä `database` samassa Compose-verkossa. Asetus?

## Tilanne

Sovellus odottaa ympäristömuuttujaa:

```
DB_HOST=database
```

Compose-palvelu on nimetty `db`:

```yaml
services:
  db:
    image: postgres:16
  app:
    image: myapp:latest
    environment:
      DB_HOST: database
```

Hostname `database` ei resolvdu — DNS-nimi on `db` (palvelun nimi).

## Ratkaisu

**Palvelunimi tai network alias user-defined networkissä — Compose DNS tavoittaa kontin.** Service name DNS user-defined networkissa.

Vaihtoehto 1 — nimeä palvelu uudelleen:

```yaml
services:
  database:
    image: postgres:16
  app:
    image: myapp:latest
    environment:
      DB_HOST: database
```

Vaihtoehto 2 — alias:

```yaml
services:
  db:
    image: postgres:16
    networks:
      default:
        aliases:
          - database
  app:
    image: myapp:latest
    environment:
      DB_HOST: database
```

## Käytännössä

Alias on parempi migraatiossa, kun et voi muuttaa palvelun nimeä heti. Testaa: `docker compose exec app getent hosts database`. Pidä konfiguraatio ja DNS-nimi synkassa — dokumentoi compose-tiedostossa.

[Lue lisää](https://docs.docker.com/compose/how-tos/networking/)
