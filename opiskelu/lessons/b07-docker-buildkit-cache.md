# CI-buildit ovat hitaita vaikka Dockerfile on optimoitu. BuildKit-ominaisuus joka auttaa?

## Tilanne
Dockerfile on optimoitu layer-järjestyksellä, mutta CI-buildit ovat silti hitaita — npm/go mod lataus toistuu joka jobissa.

## Ratkaisu
**RUN --mount=type=cache säilyttää npm/go mod -cachen buildien välillä CI:ssä.**

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
```

BuildKit cache mounts persist directories — Docker build cache.

## Käytännössä
Ota BuildKit: `DOCKER_BUILDKIT=1`. CI: registry cache (`--cache-to type=registry`) jobien välillä.

[Lue lisää](https://docs.docker.com/build/cache/)
