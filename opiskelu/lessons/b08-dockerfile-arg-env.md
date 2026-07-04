# Build-time versio build-argilla — runtime config erikseen. Ero ARG vs ENV?

## Tilanne
Build-arg `VERSION` buildissa, runtime config `LOG_LEVEL` ajona. Tiimi sekoittaa ARG:n ja ENV:n.

## Ratkaisu
**ARG on voimassa vain build-vaiheessa — ENV jää imageen runtime-käyttöön.**

```dockerfile
ARG VERSION=0.0.0
RUN echo "Building ${VERSION}"
ENV LOG_LEVEL=info
ENV APP_VERSION=${VERSION}
```

ARG build-scoped, ENV runtime — Dockerfile reference.

## Käytännössä
ARG ei ole runtime-muuttuja (`docker run -e` ei näe ARG:ia ellei kopioitu ENV:ään). Älä käytä ARG salaisuuksille — ne näkyvät build-historiassa.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#arg)
