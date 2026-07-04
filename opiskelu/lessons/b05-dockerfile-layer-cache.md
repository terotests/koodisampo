# Docker build on hidas — jokainen koodirivin muutos invalidoi koko npm install -kerroksen. Korjaus?

## Tilanne
Jokainen koodirivin muutos pakottaa täyden `npm install`:n, koska lähdekoodi kopioidaan ennen riippuvuuksia:

```dockerfile
COPY . .
RUN npm ci
```

## Ratkaisu
**Kopioi package.json ensin, asenna riippuvuudet, vasta sitten COPY lähdekoodi.**

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src/ public/ ./
RUN npm run build
```

Layer cache hyödyntää muuttumattomia kerroksia — Dockerfile best practices.

## Käytännössä
`.dockerignore` + BuildKit cache mount CI:lle. Mittaa layer-koot `docker history`:lla.

[Lue lisää](https://docs.docker.com/build/cache/)
