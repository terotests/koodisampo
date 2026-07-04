# Postgres data katoaa `docker compose down` jälkeen. Mikä puuttui?

## Tilanne

Kehittäjä ajoi compose-stackin:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
```

Kaikki toimi viikon ajan. Sitten:

```bash
docker compose down -v
```

Kaikki data katosi. Kehittäjä luuli `down`-komennon vain pysäyttävän palvelut — mutta `-v`-lippu poisti myös volumet.

Ilman määriteltyä named volumea PostgreSQL tallentaa datan kontin sisäiseen filesystemiin, joka katoaa kontin mukana.

## Ratkaisu

**Named volume määritelty palvelulle** — `down` ei poista named volumeja ilman `-v`-lippua:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Named volumes säilyvät `docker compose down` -komennon jälkeen. Vain `docker compose down -v` poistaa ne tarkoituksellisesti.

## Käytännössä

Opeta tiimille ero `down` ja `down -v` välillä. Tuotantoscripteissä älä koskaan käytä `-v`-lippua ilman eksplisiittistä vahvistusta. Lisää volume kaikkiin stateful-palveluihin compose-tiedoston `volumes`-osiossa heti alusta.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
