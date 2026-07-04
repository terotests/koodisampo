# Sama Dockerfile eri versioille — BASE_IMAGE vaihtelee CI:ssä. Miten parametrisoit?

## Tilanne
Sama Dockerfile buildaa dev-, staging- ja prod-imageja eri base-imagesta. Hardkoodattu `FROM` vaatii kolme Dockerfilea.

## Ratkaisu
**ARG BASE_IMAGE + docker build --build-arg BASE_IMAGE=....**

```dockerfile
ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE}
ARG APP_VERSION=dev
LABEL version=${APP_VERSION}
```

```bash
docker build --build-arg BASE_IMAGE=node:20.11-alpine --build-arg APP_VERSION=1.4.2 .
```

ARG on build-time parametri — Dockerfile ARG docs.

## Käytännössä
ARG ei jää runtimeen (ellei kopioi ENV:ään). Pin base-image digest CI:ssä toistettavuuden vuoksi.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#arg)
