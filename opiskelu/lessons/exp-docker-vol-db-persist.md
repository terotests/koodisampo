# Postgres-kontti poistettiin `docker rm` — data katosi. Miten olisi pitänyt tallentaa data?

## Tilanne

Kehitysympäristössä ajoit PostgreSQL-kontin nopeasti testausta varten:

```bash
docker run -d --name pg \
  -e POSTGRES_PASSWORD=secret \
  postgres:16
```

Sovellus tallensi käyttäjät ja tilaukset tietokantaan. Viikon jälkeen päivitit image-version ja poistit vanhan kontin:

```bash
docker rm -f pg
docker run -d --name pg ...
```

Kontti käynnistyi, mutta kaikki taulut olivat tyhjiä. PostgreSQL tallentaa datansa oletuksena konttikerroksen sisään — kun kontti poistetaan, writable layer ja sen sisältö katoavat mukana.

## Ratkaisu

Käytä **named volumea** datan säilyttämiseen konttien elinkaaren yli:

```bash
docker volume create pgdata

docker run -d --name pg \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

`-v pgdata:/var/lib/postgresql/data` mounttaa Dockerin hallitseman volumen PostgreSQLin datahakemistoon. Named volumet elävät konttien ulkopuolella — `docker rm` poistaa kontin, mutta volume ja sen data säilyvät. Voit varmistaa: `docker volume ls` ja `docker volume inspect pgdata`.

## Käytännössä

Compose-tuotannossa määrittele volume eksplisiittisesti palvelun alle — älä luota oletuksiin. Dokumentoi backup-käytäntö heti kun named volume otetaan käyttöön. `docker volume prune` poistaa käyttämättömät volumet — varmista ettei CI aja sitä tuotantodatan päällä.

[Lue lisää](https://docs.docker.com/storage/volumes/)
