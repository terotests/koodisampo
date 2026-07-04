# PostgreSQL data katoaa containerin poiston jälkeen — mitä käytit väärin?

## Tilanne

Compose-tiedostossa PostgreSQL määriteltiin näin:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
```

Kehityksessä kaikki toimi. Kun poistit kontin `docker rm db` image-päivityksen yhteydessä, kaikki testidata katosi. Uudelleenkäynnistyksen jälkeen tietokanta oli tyhjä kuin ensimmäisellä kerralla.

PostgreSQL tallentaa datansa `/var/lib/postgresql/data`-hakemistoon. Ilman erillistä storagea se elää kontin writable layerissa — poisto tarkoittaa datan poistoa.

## Ratkaisu

**Named volume puuttui** — lisää se datan säilyttämiseksi:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Tai `docker run`-komennolla:

```bash
docker run -d -v pgdata:/var/lib/postgresql/data postgres:16
```

Named volumes säilyvät containerin elämän jälkeen — `docker rm` ei poista volumea ellei sitä poisteta erikseen.

## Käytännössä

Lisää volume jokaiseen stateful-palveluun compose-tiedostossa heti alusta. `docker compose down` ei poista named volumeja — mutta `docker compose down -v` poistaa. Dokumentoi tämä tiimille, jotta kukaan ei aja `-v`-lippua vahingossa tuotantodataa vastaan.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
