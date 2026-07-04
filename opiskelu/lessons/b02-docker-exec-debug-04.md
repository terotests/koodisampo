# Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisältä?

## Tilanne
Distroless-image ei sisällä shelliä, mutta HTTP-palvelu vastaa. Tarvitset päästä prosessin namespaceen tarkistamaan konfiguraatiota tai verkkoyhteyttä.

## Ratkaisu
**docker exec avaa shellin konttiin tai debug-sidecar distroless:lle.**

Jos shell on saatavilla:

```bash
docker exec -it mycontainer /bin/sh
```

Distroless-debug-image tai sidecar:

```bash
docker run -it --pid=container:mycontainer --network=container:mycontainer \
  debian:bookworm-slim bash
```

docker exec avaa prosessin namespaceen — docker exec docs.

## Käytännössä
Tuotannossa rajoita `docker exec`-oikeudet. Distroless: käytä erillistä debug-imagea vain incident-tilanteissa.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
