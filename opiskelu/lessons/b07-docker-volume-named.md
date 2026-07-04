# DB-data katoaa kontin poiston jälkeen. Miten säilytät datan?

## Tilanne

Testiympäristössä ajoit tietokannan yksinkertaisesti:

```bash
docker run -d --name db postgres:16
```

Kehityksen edetessä tietokantaan kertyi testidataa. Image-päivityksen yhteydessä:

```bash
docker stop db && docker rm db
docker run -d --name db postgres:16
```

Kaikki taulut olivat tyhjiä. Ilman erillistä storagea PostgreSQLin data elää kontin writable layerissa, joka poistuu kontin mukana.

## Ratkaisu

Luo **named volume** ja mounttaa se PostgreSQLin datahakemistoon:

```bash
docker volume create dbdata

docker run -d --name db \
  -v dbdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16
```

Volumes persist beyond container lifecycle — `docker rm db` poistaa kontin, mutta `dbdata`-volume säilyy. Uudelleenkäynnistyksessä mounttaa sama volume:

```bash
docker run -d --name db -v dbdata:/var/lib/postgresql/data postgres:16
```

## Käytännössä

Tämä on perus Docker-käytäntö kaikille stateful-palveluille. Compose:ssa määrittele volume `volumes`-osiossa. Varmista backup ennen image-päivityksiä — volume säilyy, mutta major version upgrade voi vaatia migraation.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
