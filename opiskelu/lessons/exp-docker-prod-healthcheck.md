# Load balancer lähettää liikenteen kontille joka on jumissa. Miten Docker tunnistaa unhealthy-tilan?

## Tilanne
Load balancer ohjaa liikennettä kolmelle API-kontille. Yksi kontti on jumissa — prosessi elää, mutta event loop on deadlockissa. LB jatkaa requestien lähettämistä, koska TCP-yhteys porttiin 8080 avautuu.

## Ratkaisu
**HEALTHCHECK tai --health-cmd testaa readinessin säännöllisesti.**

Dockerfile:

```dockerfile
HEALTHCHECK CMD curl -f http://localhost:8080/ready || exit 1
```

`docker run`:

```bash
docker run --health-cmd='curl -f http://localhost:8080/ready || exit 1' \
  --health-interval=10s --health-retries=3 myapp
```

HEALTHCHECK ajaa testikomennon säännöllisesti — unhealthy status orchestratorille.

## Käytännössä
Orkestraattorit (Swarm, Compose, K8s) käyttävät eri readiness-malleja — varmista että health-endpoint vastaa todellista palvelukykyä. Poista liikenne unhealthy-konteista LB:ssä.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
