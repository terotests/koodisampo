# Docker build lähettää 2 GB node_modules build contextiin. Ensimmäinen optimointi?

## Tilanne
`docker build` lähettää 2 GB build contextia — mukana `node_modules`, `.git` ja vanhat build-artifaktit. Context upload vie minuutteja ennen ensimmäistäkään layeria.

## Ratkaisu
**.dockerignore — sulje node_modules, .git, build-artifaktit.**

```
node_modules
.git
*.log
dist
coverage
.env
```

`.dockerignore` pienentää contextia — Dockerfile best practices.

## Käytännössä
Tarkista context-koko: `docker build --progress=plain . 2>&1 | head`. Pidä `.dockerignore` versionhallinnassa ja päivitä kun projektirakenne muuttuu.

[Lue lisää](https://docs.docker.com/build/building/context/)
