# Yksi kontti syö koko hostin CPU:n — muut palvelut jäätyvät. Compose-rajoitus?

## Tilanne
Yksi kontti syö 100 % CPU:sta — muut palvelut jäätyvät. Ei rajoja compose-tiedostossa.

## Ratkaisu
**deploy.resources.limits cpus/memory tai docker run --cpus --memory rajoittaa konttia.**

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1G
    reservations:
      memory: 256M
```

Resource constraints — Docker run/compose docs.

## Käytännössä
`deploy`-osion tuki on Compose-specissä optional — varmista että ympäristösi soveltaa rajoja. Swarm/K8s käyttää reservations schedulingiin. Load test rajojen alle ja yli — varmista OOM-käyttäytyminen.

[Lue lisää](https://docs.docker.com/reference/compose-file/deploy/#resources)
