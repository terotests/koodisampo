# Dockerfile: `VOLUME /data` — data katoaa kontin poiston jälkeen. Miksi?

## Tilanne

Dockerfile määrittelee datan tallennuksen:

```dockerfile
FROM alpine
COPY app /app
VOLUME /data
CMD ["/app/server"]
```

Kontti käynnistyy ja tallentaa dataa `/data`-hakemistoon. Poiston jälkeen:

```bash
docker rm mycontainer
docker volume prune
```

Kaikki data katosi. Kehittäjä luuli `VOLUME`-direktiivin tarkoittavan pysyvää tallennusta.

## Ratkaisu

**Anonymous volume poistuu kontin mukana** — `VOLUME /data` luo anonyymin volumen, joka on sidottu tiettyyn konttiin. Kun kontti poistetaan, anonyymi volume jää "dangling"-tilaan ja `docker volume prune` poistaa sen.

Nimeä volume erikseen säilyttääksesi datan:

```bash
docker run -d -v mydata:/data myapp:latest
```

Tai Compose:

```yaml
services:
  app:
    volumes:
      - appdata:/data

volumes:
  appdata:
```

Named vs anonymous volumes — vain nimetty volume säilyy konttien elinkaaren yli ja on tarkoituksellisesti hallittavissa.

## Käytännössä

Poista `VOLUME`-direktiivi Dockerfilesta ja määrittele storage compose- tai run-komennossa. Named volume on eksplisiittinen — se näkyy `docker volume ls`:ssä ja voidaan backupata. Älä luota anonyymeihin volumeihin tuotantodatalle.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
