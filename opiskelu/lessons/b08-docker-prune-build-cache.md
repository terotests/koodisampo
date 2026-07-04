# Build-serverin levy täynnä vanhoja kerroksia. Turvallinen siivous?

## Tilanne
Build-serverin levy täynnä BuildKit-kerroksia — `docker system df` näyttää BUILD CACHE gigatavuina.

## Ratkaisu
**docker builder prune poistaa käyttämättömän build-cachen turvallisesti.**

```bash
docker builder prune -f
docker builder prune -af --filter until=168h
```

builder prune cleans build cache — docker builder prune.

## Käytännössä
Ero `docker system prune` vs `docker builder prune`. Ajoita CI-runnerille, säilytä tuore cache `--filter until=`.

[Lue lisää](https://docs.docker.com/reference/cli/docker/builder/prune/)
