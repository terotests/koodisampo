# docker build lähettää gigatavun node_modules kontekstissa. Miten estät?

## Tilanne
`docker build` lähettää 1.5 GB kontekstia — `Sending build context to Docker daemon` kestää minuutteja. Mukana `node_modules` ja `.git` vaikka ne asennetaan kontissa.

## Ratkaisu
**.dockerignore sulkee tarpeettomat tiedostot pois build-kontekstista.**

```
node_modules
.git
**/*.md
.coverage
dist
.env*
```

dockerignore reduces context — Docker docs dockerignore.

## Käytännössä
Riippuvuudet asennetaan `RUN npm ci`:lla kontissa — ei tarvitse local node_modules contextissa. Tarkista context-koko build-lokista.

[Lue lisää](https://docs.docker.com/build/building/context/#dockerignore-files)
