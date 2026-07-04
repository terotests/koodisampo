# CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat?

## Tilanne
CI-buildit ovat hitaita. Jokainen commit jossa `package.json` muuttuu — tai koko `COPY . .` invalidoituu — pakottaa täyden `npm ci`:n.

Build-loki näyttää dependency-vaiheen kestävän minuutteja vaikka lock-tiedosto olisi ennallaan.

## Ratkaisu
**Kopioi package.json ensin, npm install, vasta sitten lähdekoodi.**

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
RUN npm run build
```

Layer cache invalidoituu muuttuneesta layerista alaspäin — optimoi muuttumaton ensin.

## Käytännössä
Lisää `.dockerignore` ja BuildKit `RUN --mount=type=cache` CI-putkeen. Mittaa build-aika ennen/jälkeen — dependency-layerin pitäisi cachettua kun vain lähdekoodi muuttuu.

[Lue lisää](https://docs.docker.com/build/cache/)
