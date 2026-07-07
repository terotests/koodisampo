# Docker build on hidas — pienikin koodimuutos ajaa npm ci:n uudelleen. Fix?

## Tilanne

Dockerfile kopioi ensin koko projektin ja asentaa vasta sitten riippuvuudet:

```dockerfile
COPY . .
RUN npm ci
```

CI-build venyy turhaan, koska pienikin lähdekoodimuutos invalidoi `COPY . .` -layerin. Sen jälkeen myös `RUN npm ci` ajetaan uudelleen, vaikka `package.json` ja `package-lock.json` eivät olisi muuttuneet.

## Ratkaisu

**Kopioi dependency-manifestit ensin, aja `npm ci`, ja kopioi vasta sitten lähdekoodi.**

```dockerfile
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

Nyt riippuvuuksien asennus pysyy cachessa niin kauan kuin `package.json` ja `package-lock.json` eivät muutu.

## Käytännössä

Lisää `.dockerignore`, jotta esimerkiksi `node_modules`, `.git`, build-artifaktit ja `.env` eivät päädy build contextiin tai invalidoi cachea turhaan.

```dockerignore
node_modules
.git
dist
coverage
*.log
.env
```

CI:ssä voit lisäksi käyttää BuildKit cache mountia npm-cachen säilyttämiseen (erillinen optimointi layer-järjestyksen lisäksi):

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm npm ci
```

[Lue lisää](https://docs.docker.com/build/cache/optimize/)
