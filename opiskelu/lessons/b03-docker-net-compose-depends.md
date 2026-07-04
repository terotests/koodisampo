# App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused. Compose-korjaus?

## Tilanne

```yaml
services:
  app:
    image: myapp:latest
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
```

Ensimmäisellä `docker compose up`:lla app kaatuu:

```
Error: connect ECONNREFUSED db:5432
```

`depends_on` ilman healthcheckia odottaa vain kontin **käynnistymistä**, ei Postgresin **valmiutta** hyväksymään yhteyksiä. db-kontti on olemassa, mutta PostgreSQL ei ole vielä valmis.

## Ratkaisu

**`depends_on` + healthcheck db:lle tai odota retry-logiikka appissa.** depends_on odottaa käynnistystä, ei readinessia — healthcheck + retry.

```yaml
services:
  app:
    image: myapp:latest
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 5s
      timeout: 3s
      retries: 5

```

Lisäksi sovelluksessa connection retry (exponential backoff) on tuotantokelpoinen varmuusverkko.

## Käytännössä

Healthcheck-komento pitää vastata todellista readiness-kriteeriä (`pg_isready`, HTTP `/health`). CI:ssä testaa cold start — `depends_on` yksin ei riitä ilman healthcheckia Compose v2+:ssa. Kubernetesissa vastaava on startupProbe + readinessProbe.

[Lue lisää](https://docs.docker.com/compose/how-tos/startup-order/)
