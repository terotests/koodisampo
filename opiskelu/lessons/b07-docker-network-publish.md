# Kontti kuuntelee 8080 — host ei tavoita localhost:8080. docker run?

## Tilanne

Käynnistät web-kontin:

```bash
docker run -d myweb:latest
docker ps
# CONTAINER ID   PORTS (tyhjä)
```

Kontissa sovellus kuuntelee porttia 8080 (`docker exec ... ss -tlnp` näyttää `0.0.0.0:8080`). Hostilta:

```bash
curl http://localhost:8080
curl: (7) Failed to connect to localhost port 8080
```

Kontti on eristetyssä bridge-verkossa — porttia ei ole julkaistu hostille.

## Ratkaisu

**`-p 8080:8080`** mapaa kontin portin hostille — publish port mapping. EXPOSE dokumentoi, -p publishaa.

```bash
docker run -d -p 8080:8080 myweb:latest
curl http://localhost:8080
```

UDP:lle: `-p 8080:8080/udp`. Tietylle interface:lle: `-p 127.0.0.1:8080:8080`.

## Käytännössä

`docker ps` PORTS-sarake kertoo heti, onko publish kunnossa. Tuotannossa bindaa vain tarvittavaan interfaceen — älä altista palvelua `0.0.0.0`:lle turhaan. Compose: `ports: ["8080:8080"]`.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/run/#publish)
