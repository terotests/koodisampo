# Security review: kontti ajaa rootina. Mikä on Dockerin suositus tuotantoon?

## Tilanne
Penetraatiotestin finding: kontti UID 0. Hyökkääjä container-escapen jälkeen saisi root-oikeudet hostilla helpommin.

## Ratkaisu
**USER non-root — luo käyttäjä Dockerfilessa.**

```dockerfile
RUN groupadd -r app && useradd -r -g app app
USER app
WORKDIR /home/app
COPY --chown=app:app . .
CMD ["./bin/server"]
```

Root kontissa on escape-riski — Docker security docs.

## Käytännössä
Rootless Docker host-tasolla lisäsuoja. Varmista volume-oikeudet (`COPY --chown`).

[Lue lisää](https://docs.docker.com/engine/security/rootless/)
