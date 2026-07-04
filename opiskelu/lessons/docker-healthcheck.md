# Orkestraattori käynnistää uuden kontin ennen vanhan poistoa. Mikä Dockerfile-ominaisuus auttaa?

## Tilanne
Kubernetes tai Docker Swarm tekee rolling updaten. Uusi versio käynnistyy, mutta orkestraattori poistaa vanhan vasta kun uusi on "valmis". Ilman healthcheckiä uusi kontti merkitään käynnissä olevaksi heti kun prosessi starttaa — vaikka sovellus vielä lataa migraatioita tai jää jumiin.

## Ratkaisu
**HEALTHCHECK kertoo orkestraattorille kun probe-komento onnistuu.**

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

Compose v2:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 10s
  timeout: 3s
  retries: 3
```

HEALTHCHECK erottaa 'käynnissä' vs 'palvelee oikein'.

## Käytännössä
Health-endpointin pitää testata riippuvuuksia (DB, cache), ei pelkkää 200 OK -vastauksia staattiselta sivulta. `start-period` antaa hitaille käynnistyksille aikaa ennen kuin epäonnistumiset lasketaan.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
