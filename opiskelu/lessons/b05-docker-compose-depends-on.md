# App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused -virheeseen. Compose-korjaus?

## Tilanne
App-kontti logittaa `Connection refused` heti käynnistyksessä — Postgres ei ole vielä valmis acceptoimaan yhteyksiä.

## Ratkaisu
**depends_on + healthcheck db:lle — odota valmiutta.**

```yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 3s
      timeout: 5s
      retries: 10
  app:
    depends_on:
      db:
        condition: service_healthy
```

depends_on condition service_healthy odottaa healthcheckiä — Compose docs.

## Käytännössä
App-tason exponential backoff yhteyksille on backup kun healthcheck riittää. Migraatiot ennen trafficia.

[Lue lisää](https://docs.docker.com/compose/how-tos/startup-order/)
