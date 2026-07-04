# Docker build on hidas — jokainen pieni koodimuutos invalidoi koko dependency layerin. Fix?

## Tilanne
Docker build on hidas — jokainen pieni koodimuutos invalidoi koko dependency layerin:

```dockerfile
COPY . .
RUN npm ci
```

CI-build venyy turhaan, koska layer cache invalidoituu koko kontekstin kopioinnilla.

## Ratkaisu
**COPY package.json ensin, sitten lähdekoodi — layer cache säilyy.**

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

Layer ordering optimoi cache — Dockerfile best practices.

## Käytännössä
`.dockerignore` estää turhien tiedostojen invalidoivan cachea. CI: käytä BuildKit cache mounteja npm-cachen säilyttämiseen.

[Lue lisää](https://docs.docker.com/build/cache/)
