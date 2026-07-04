# Compose-pino käynnistää riippuvat palvelut ennen kuin API on valmis. Mitä lisätä serviceen?

## Tilanne
Compose-pino käynnistää API:n ennen Redis/Postgres on valmis. Palvelu crash loopaa connection refused -virheeseen.

## Ratkaisu
**healthcheck + depends_on condition odottaa palvelun healthy-tilan ennen käynnistystä.**

```yaml
services:
  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
  api:
    depends_on:
      redis:
        condition: service_healthy
```

Compose healthcheck — Docker docs compose file healthcheck.

## Käytännössä
Määritä healthcheck kaikille riippuvuuksille joita app odottaa käynnistyksessä. App retry silti suositeltava.

[Lue lisää](https://docs.docker.com/reference/compose-file/services/#healthcheck)
