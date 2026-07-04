# Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus?

## Tilanne
Yksi muistivuoto kontissa syö koko hostin RAM:in. Linux OOM-killer tappaa muita palveluita — mukaan lukien tietokannan.

## Ratkaisu
**docker run --memory 512m --cpus 1.0 rajoittaa resurssikäytön.**

```bash
docker run -d \
  --memory 512m \
  --cpus 1.0 \
  --memory-swap 512m \
  leaky-service:latest
```

Resource limits — docker run docs.

## Käytännössä
Aseta rajat kaikille tuotantokonttien compose-palveluille (`deploy.resources.limits`). Monitoroi `docker stats` ja hälytä kun kontti osuu kattoon.

[Lue lisää](https://docs.docker.com/config/containers/resource_constraints/)
