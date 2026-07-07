# Kontti syö koko hostin RAM:in — OOM killaa naapurikontteja. docker run rajoitus?

## Tilanne
Muistivuotoinen kontti syö hostin RAM:in. OOM-killer tappaa Postgres-kontin naapurina.

## Ratkaisu
**--memory ja --cpus (tai deploy.resources compose:ssa).**

```bash
docker run --memory 512m --cpus 1.5 --memory-swap 512m app
```

Resource limits käyttävät cgroups — docker run docs.

## Käytännössä
`--memory-swap` = `--memory` estää swapin käytön rajojen kiertämiseen. Compose `deploy.resources.limits` on platform-riippuvainen — testaa että rajat oikeasti voimaan. Dokumentoi limitit per palvelu.

[Lue lisää](https://docs.docker.com/engine/containers/resource_constraints/)
