# Dev-ympäristössä haluat hostin portin 3000-3005 mapattuna. Compose-syntaksi?

## Tilanne

Microfrontend-kehityksessä kuusi palvelua kuuntelee portteja 3000–3005 konteissa. Jokainen pitää tavoittaa hostilta samalla porttinumerolla selaimesta:

```
http://localhost:3000  → shell
http://localhost:3001  → auth
...
http://localhost:3005  → admin
```

Manuaalinen kirjoitus on työlästä:

```yaml
ports:
  - "3000:3000"
  - "3001:3001"
  # ... kuusi riviä
```

## Ratkaisu

**`ports: '3000-3005:3000-3005'`** tai erilliset rivit mapaavat porttialueen hostille. Port publishing — Compose ports syntax.

```yaml
services:
  dev-stack:
    image: mydev:latest
    ports:
      - "3000-3005:3000-3005"
```

Tai usealle palvelulle erikseen:

```yaml
services:
  shell:
    ports: ["3000:3000"]
  auth:
    ports: ["3001:3001"]
  # ...
```

Porttialue-mapaus toimii kun kontin sisäiset portit vastaavat hostin portteja 1:1.

## Käytännössä

Laajat porttialueet voivat törmätä muihin dev-palveluihin hostilla — dokumentoi varatut portit tiimille. Tuotannossa älä julkaise laajoja alueita; käytä reverse proxya yhden 443-portin takana. Tarkista `docker compose ps` PORTS-sarake varmistamaan mapitus.

[Lue lisää](https://docs.docker.com/reference/compose-file/services/#ports)
