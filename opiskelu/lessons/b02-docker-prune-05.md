# Levy täynnä vanhoja imageja ja stopped containereita. Turvallinen siivous?

## Tilanne
Build-palvelimen levy on täynnä. `docker images` listaa satoja `<none>`-tageja ja `docker ps -a` näyttää kymmeniä Exited-kontteja.

## Ratkaisu
**docker system prune -a poistaa käyttämättömät imaget ja containerit.** Ilman `-a`:ta prune poistaa pysäytetyt kontit, käyttämättömät verkot, dangling-imaget (`<none>`) ja build-cachen. `-a` poistaa lisäksi tagatut imaget, joita mikään kontti ei käytä.

```bash
# Esikatselu
docker system df

# Siivous (kysyy vahvistuksen); -a poistaa myös vanhat tagatut imaget
docker system prune -a

# CI: automaattinen
docker system prune -af --filter "until=168h"
```

prune poistaa käyttämättömät resurssit — docker system prune docs.

## Käytännössä
Älä aja `prune -a` tuotantohostilla ilman varmuuskopioita — se poistaa kaikki käyttämättömät imaget. Ajoita siivous CI-runnerille, ei tuotantoon.

[Lue lisää](https://docs.docker.com/reference/cli/docker/system/prune/)
