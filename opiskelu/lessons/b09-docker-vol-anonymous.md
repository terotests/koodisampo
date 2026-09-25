# Dockerfile: `VOLUME /data` — kontti korvataan uudella, ja data näyttää kadonneen. Miksi?

## Tilanne

Dockerfile määrittelee datan tallennuksen:

```dockerfile
FROM alpine
COPY app /app
VOLUME /data
CMD ["/app/server"]
```

Kontti käynnistyy ja tallentaa dataa `/data`-hakemistoon. Deployssa kontti korvataan uudella:

```bash
docker rm -f mycontainer
docker run -d --name mycontainer myapp:latest
```

Uuden kontin `/data` on tyhjä — data näyttää kadonneen. Kehittäjä luuli `VOLUME`-direktiivin tarkoittavan pysyvää tallennusta.

## Ratkaisu

**Uusi kontti saa uuden anonyymin volumen** — `VOLUME /data` luo jokaiselle kontille oman, satunnaisesti nimetyn volumen. Vanha volume ei liity uuteen konttiin vaan jää orvoksi (dangling). Pelkkä `docker rm` ei poista sitä, mutta `docker rm -v`, `docker run --rm` ja `docker volume prune` poistavat — silloin data katoaa lopullisesti.

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
