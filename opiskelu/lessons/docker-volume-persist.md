# Kontin tietokanta katoaa `docker rm` jälkeen. Miten data säilyy oikein?

## Tilanne
Kehityksessä Postgres-kontti toimii hyvin. Poistat kontin testataksesi puhdasta käynnistystä:

```bash
docker rm -f my-db
```

Seuraavalla `docker run`-kerralla tietokanta on tyhjä — kaikki käyttäjät ja migraatiot ovat kadonneet. Data oli kontin writable layerissa, joka poistui `docker rm`:n mukana.

## Ratkaisu
**Named volume tai bind mount.**

Named volume (suositus tietokannoille):

```bash
docker run -d \
  --name my-db \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

Compose:

```yaml
services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Volumet elävät konttien elinkaaren ulkopuolella — oikea tapa pysyvään dataan.

## Käytännössä
Varmuuskopioi volumet erikseen (`docker run --rm -v pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pg.tgz /data`). Älä tallenna tietokantaa pelkkään kontin filesystemiin ilman volumea.

[Lue lisää](https://docs.docker.com/storage/volumes/)
