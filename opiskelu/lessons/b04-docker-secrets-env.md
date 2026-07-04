# Tuotanto: salasanat ENV-muuttujina Dockerfile:ssa. Turvallisempi Compose/Swarm tapa?

## Tilanne
Dockerfile sisältää `ENV API_KEY=sk-live-...`. Avain on image-layerissa — näkyy `docker history`:ssa.

## Ratkaisu
**secrets mount tiedostona /run/secrets/ — ei image layerissa.**

```yaml
services:
  api:
    secrets:
      - api_key
    environment:
      API_KEY_FILE: /run/secrets/api_key

secrets:
  api_key:
    file: ./secrets/api_key
```

Docker secrets eivät päädy imageen — docs.docker.com/compose/use-secrets.

## Käytännössä
Build-time salaisuudet: `RUN --mount=type=secret` BuildKitillä. Älä koskaan `ARG` + `ENV` salaisuuksille.

[Lue lisää](https://docs.docker.com/compose/how-tos/use-secrets/)
