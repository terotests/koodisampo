# Kehityksessä haluat live-reload lähdekoodilla hostilta. Volume-tyyppi?

## Tilanne

Kehität Node.js-sovellusta ja haluat nähdä koodimuutokset heti ilman image rebuildia. Nykyinen workflow:

```bash
docker build -t myapp .
docker run myapp
# Muokkaa koodia → docker build → docker run (hidas!)
```

Jokainen pieni muutos vaatii täyden rebuildin ja kontin uudelleenkäynnistyksen. Kehitysnopeus hidastuu merkittävästi.

## Ratkaisu

Käytä **bind mountia** host-lähdekoodin synkronointiin:

```bash
docker run -d \
  -v $(pwd):/app \
  -w /app \
  -p 3000:3000 \
  node:20 \
  npm run dev
```

Compose:

```yaml
services:
  web:
    build: .
    volumes:
      - .:/app
    command: npm run dev
```

Bind mount synkronoi host-lähdekoodin konttiin — nodemon tai webpack-dev-server huomaa muutokset ja reloadaa automaattisesti. Bind mounts host path into container on dev-ympäristön standardikäytäntö.

## Käytännössä

Bind mount sopii kehitykseen, ei tuotantoon — tuotannossa koodi kuuluu imageen. macOS/Windows:ssa harkitse `:cached` tai `:delegated` mount-optiota suorituskyvyn parantamiseksi. `.dockerignore` ja erillinen `node_modules`-volume estävät host/guest-riippuvuuskonfliktit.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/)
