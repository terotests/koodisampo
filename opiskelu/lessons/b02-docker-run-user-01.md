# Containeri ajaa rootina tuotannossa — audit finding. Ensimmäinen hardening?

## Tilanne
Audit finding: tuotantokontti ajaa rootina (UID 0). `docker exec` ja `id` palauttavat `uid=0(root)`. Escape-haavoittuvuuden hyödyntäminen antaisi host-tason oikeudet.

## Ratkaisu
**docker run --user nonroot tai USER-Dockerfilessa non-rootille.**

Dockerfile:

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
CMD ["./server"]
```

Tai ajonaikainen override:

```bash
docker run --user 10001:10001 myapp
```

Non-root user vähentää escape-riskiä — Docker docs security.

## Käytännössä
Varmista `COPY --chown` ja oikeudet volumeille. Rootless Docker host-tasolla on lisäkerros, mutta USER imagessa on minimivaatimus.

[Lue lisää](https://docs.docker.com/engine/containers/run/#user)
