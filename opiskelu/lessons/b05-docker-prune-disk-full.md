# Build-palvelimen levy täynnä — vanhoja imageja ja stopped-kontteja pinossa. Turvallisin siivous?

## Tilanne
Build-palvelimen juuripartitio on 100 % täynnä — vanhoja imageja, stopped-kontteja ja build-cachea pinoutunut kuukausiksi.

CI-buildit kaatuvat `no space left on device` -virheeseen.

## Ratkaisu
**docker system prune — poistaa käyttämättömät resurssit (tarkista ensin).**

```bash
docker system df
docker system prune -f
docker builder prune -af --filter until=168h
```

docker system prune siivoaa dangling resursseja — CLI docs.

## Käytännössä
Aja `docker system df` ennen prunea. Tuotantohostilla varovasti — varmista ettei tarvittavia imageja poistu (`prune -a`).

[Lue lisää](https://docs.docker.com/reference/cli/docker/system/prune/)
