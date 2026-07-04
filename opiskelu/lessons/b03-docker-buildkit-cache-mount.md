# npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. BuildKit-parannus?

## Tilanne

Dockerfile asentaa riippuvuudet jokaisessa buildissa:

```dockerfile
COPY . .
RUN npm ci
```

`package-lock.json` ei muutu, mutta `COPY . .` invalidoi layer-cachen kun mikä tahansa lähdekoodi muuttuu — `npm ci` lataa kaiken uudelleen verkosta. CI-buildit venyvät 5 minuuttiin turhaan.

## Ratkaisu

Kaksi optimointia:

**1. Erottele riippuvuudet ja lähdekoodi:**

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build
```

**2. BuildKit cache mount** — npm-cache säilyy buildien välillä:

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline
```

Ota BuildKit käyttöön: `DOCKER_BUILDKIT=1` tai `docker buildx build`.

## Käytännössä

Cache mount on tehokkain kun `package-lock` muuttuu harvoin. `.dockerignore` estää turhien tiedostojen kopioinnin. Mittaa build-aika ennen/jälkeen — npm-vaihe pitäisi pudota sekunnteihin lockin ollessa ennallaan.

[Lue lisää](https://docs.docker.com/build/cache/)
