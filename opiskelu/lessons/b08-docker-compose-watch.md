# Dev: lähdekoodimuutos pitäisi synkata konttiin ilman rebuildia joka kerta. Compose Watch?

## Tilanne
Dev-työ: jokainen koodimuutos vaatii `docker compose build` + restart — hitaampaa kuin local dev.

## Ratkaisu
**develop.watch sync — compose watch synkkaa tiedostot ja voi restartata palvelun.**

```yaml
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
```

```bash
docker compose watch
```

Compose Watch file sync — Compose watch docs.

## Käytännössä
Sync hot-reload-yhteensopiville frameworkeille. rebuild action dependency-muutoksille. Vain dev — ei tuotantoon.

[Lue lisää](https://docs.docker.com/compose/how-tos/file-watch/)
