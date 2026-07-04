# Docker build on hidas. Mikä Dockerfile-järjestys hyödyntää layer cachea parhaiten?

## Tilanne
Dockerfile kopioi koko projektin ennen riippuvuuksien asennusta:

```dockerfile
FROM node:20-alpine
COPY . .
RUN npm ci
RUN npm run build
```

Jokainen yhden rivin koodimuutos invalidoi `COPY . .`-kerroksen ja pakottaa `npm ci`:n ajamaan uudelleen — build venyy minuuteista.

## Ratkaisu
**Riippuvuudet ennen lähdekoodia hyödyntää layer cachea parhaiten buildissa.**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
```

Layer invalidoituvat muuttuneesta rivistä alaspäin — optimoi järjestys.

## Käytännössä
Erottele myös konfiguraatiotiedostot, jotka muuttuvat harvoin. CI:ssä käytä `--cache-from` / BuildKit cache mounteja kun layer cache ei riitä jobien välillä.

[Lue lisää](https://docs.docker.com/build/cache/)
