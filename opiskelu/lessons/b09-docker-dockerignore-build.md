# Docker build lähettää 500 MB node_modules kontekstina vaikka ne asennetaan kontissa. Korjaus?

## Tilanne
Build lähettää 500 MB `node_modules`:ia vaikka ne asennetaan `RUN npm ci`:lla kontissa. Context upload on CI:n pullonkaula.

## Ratkaisu
**.dockerignore sulkee node_modules, .git ja build-artifaktit pois kontekstista.**

```
node_modules
.git
npm-debug.log
dist
```

`.dockerignore` pienentää build context — Dockerfile best practices.

## Käytännössä
Context upload on pullonkaula CI:ssä. Pidä `.dockerignore` ajan tasalla monorepoissa (service-kohtaiset polut).

[Lue lisää](https://docs.docker.com/build/building/context/#dockerignore-files)
