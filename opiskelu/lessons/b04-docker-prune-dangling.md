# Levy täynnä `<none>` image-tageja CI-koneella. Siivouskomento?

## Tilanne
CI-koneen levy täynnä. `docker images` näyttää kymmeniä `<none>:<none>` rivejä — dangling layerit buildien jäljiltä.

## Ratkaisu
**docker image prune tai docker system prune -f.**

```bash
docker image prune -f
docker system prune -f
```

docker image prune poistaa dangling imaget — docker prune docs.

## Käytännössä
 `docker builder prune` erikseen build-cachelle. Ajoita viikoittainen siivous CI-infraan.

[Lue lisää](https://docs.docker.com/config/pruning/)
