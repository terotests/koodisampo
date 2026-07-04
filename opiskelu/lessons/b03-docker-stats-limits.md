# Yksi kontti syö koko hostin RAM:in — muut palvelut kaatuvat. docker stats näyttää 100%. Mitä asetat?

## Tilanne
 `docker stats` näyttää yhden kontin syövän 100 % RAM:ia. Naapuripalvelut kaatuvat OOM:iin.

## Ratkaisu
**docker run --memory / --cpus tai compose deploy.resources limits.**

```bash
docker run --memory 1g --cpus 2.0 myservice
```

Compose:

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
```

Resource constraints — Docker run reference / compose deploy.

## Käytännössä
Aseta myös `reservations` scheduler-tasolla Swarmissa. Testaa rajat kuormitustestillä ennen tuotantoa.

[Lue lisää](https://docs.docker.com/config/containers/resource_constraints/)
