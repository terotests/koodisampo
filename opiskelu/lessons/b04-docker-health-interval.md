# Healthcheck merkitsee kontin unhealthy liian myöhään — 5 min outage. Mitä säätää?

## Tilanne
Sovellus jumittuu, mutta healthcheck ajetaan vain 5 minuutin välein. Outage kestää liian kauan ennen kuin orkestraattori huomaa unhealthy-tilan.

## Ratkaisu
**HEALTHCHECK --interval ja --timeout — tiheämpi tarkistus.**

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=40s \
  CMD curl -f http://localhost/health || exit 1
```

interval/timeout/retries määrittävät healthcheck-käyttäytymisen — Dockerfile HEALTHCHECK.

## Käytännössä
Liian tiheä check kuormittaa sovellusta — tasapainota interval vs. MTTR. `start_period` estää false positive -uudelleenkäynnistyksen hitaalla bootilla.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
