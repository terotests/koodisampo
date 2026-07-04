# App käynnistyy ennen Postgresia — connection refused. compose.yml korjaus?

## Tilanne
App logittaa `connection refused` Postgresiin — compose käynnistää palvelut rinnakkain ilman valmiusodotusta.

## Ratkaisu
**depends_on + healthcheck condition odottaa Postgresin valmiiksi ennen app-käynnistystä.**

```yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      retries: 5
  app:
    depends_on:
      db:
        condition: service_healthy
```

depends_on with condition waits for health — Compose docs.

## Käytännössä
 `service_started` ≠ valmis palvelemaan. Käytä aina healthcheck riippuvuuksille.

[Lue lisää](https://docs.docker.com/compose/how-tos/startup-order/)
