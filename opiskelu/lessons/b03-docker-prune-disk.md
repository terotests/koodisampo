# CI-runnerin levy täyttyy 'no space left' — satoja dangling imageja. Turvallinen siivous?

## Tilanne
CI-runner kaatuu `no space left on device` -virheeseen. Satoja dangling `<none>`-imageja pinoutuu jokaisesta buildista.

## Ratkaisu
**docker system prune -f (tai image prune) — poista käyttämättömät.**

```bash
docker image prune -f
docker builder prune -f --filter until=72h
docker system prune -f --volumes  # varovasti!
```

docker system prune siivoaa dangling resursseja — CLI docs.

## Käytännössä
Ajoita prune CI-jobin lopussa. Monitoroi levytilaa (`df -h`). `--filter until=` säilyttää tuoreet imaget rollbackia varten.

[Lue lisää](https://docs.docker.com/reference/cli/docker/system/prune/)
