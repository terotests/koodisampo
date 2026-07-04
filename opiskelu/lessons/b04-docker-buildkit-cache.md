# CI-build kopioi koko kontekstin joka kerta — cache ei hyödy package.json muutoksista. Optimointi?

## Tilanne
Dockerfile on järjestyksessä oikein, mutta CI-build kopioi koko kontekstin ja `npm ci` lataa paketit verkosta joka kerta kun mikä tahansa tiedosto muuttuu.

## Ratkaisu
**COPY package.json ensin, RUN npm ci, sitten loput — layer cache hyötyy.**

```dockerfile
# syntax=docker/dockerfile:1
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build
```

Dockerfile layer ordering hyödyntää cachea — Docker docs best practices.

## Käytännössä
Ota BuildKit käyttöön: `DOCKER_BUILDKIT=1`. CI: jaa cache registryyn (`cache-from` / `cache-to`) jobien välillä.

[Lue lisää](https://docs.docker.com/build/cache/optimize/)
