# Compose-sovellus kaatuu koska API käynnistyy ennen Postgresia. Mitä compose-tiedostoon?

## Tilanne
API-kontti kaatuu heti käynnistyksessä: `connection refused` Postgresiin. `depends_on` ilman healthcheckiä vain odottaa kontin *käynnistymistä*, ei tietokannan valmiutta.

## Ratkaisu
**depends_on + healthcheck db:lle (Compose v2 condition: service_healthy).**

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
  api:
    depends_on:
      db:
        condition: service_healthy
```

depends_on with healthcheck varmistaa valmiuden — Docker Compose docs.

## Käytännössä
Sovelluksessa retry-logiikka silti hyvä käytäntö — verkko voi fläppäillä. `start_period` healthcheckissä antaa DB:lle aikaa recoveryyn.

[Lue lisää](https://docs.docker.com/compose/how-tos/startup-order/)
