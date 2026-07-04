# Orchestrator merkitsee palvelun healthy vaikka app kaatui. Mitä Dockerfileen?

## Tilanne
Orkestraattori näyttää palvelun healthy, vaikka sovellusprosessi on kaatunut ja uudelleenkäynnistynyt väärin — tai healthcheck testaa vain portin auki oloa.

## Ratkaisu
**HEALTHCHECK testaa sovelluksen endpointia — ei pelkkää prosessin olemassaoloa.**

```dockerfile
HEALTHCHECK CMD wget -qO- http://localhost:8080/health | grep -q ok || exit 1
```

HEALTHCHECK defines container health — Dockerfile reference.

## Käytännössä
/health palauttaa 503 jos DB poissa. Vältä `CMD pgrep` — se ei testaa palvelukykyä.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
