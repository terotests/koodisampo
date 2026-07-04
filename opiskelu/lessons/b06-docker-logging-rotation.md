# Konttilokit täyttävät levyn — json-file driver kasvaa rajatta. Miten rajoitat?

## Tilanne
json-file driver täyttää levyn — yksittäinen kontti on kirjoittanut 50 GB lokia ilman rotaatiota. Oletusasetuksissa lokit kasvavat rajatta.

## Ratkaisu
**log driver opts max-size ja max-file rajaavat json-file -lokien kasvua.**

```yaml
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

Configure logging drivers — Docker docs logging configure.

## Käytännössä
Daemon-tason oletus `/etc/docker/daemon.json`:ssa. Tuotannossa keskuslokitus + rotaatio hostilla.

[Lue lisää](https://docs.docker.com/engine/logging/configure/)
