# Paikallinen dev ylikirjoittaa portit ilman muutosta git-trackattuun compose.yaml:iin. Tiedosto?

## Tilanne
Kehittäjät haluavat mapata portin 3000→8080 paikallisesti ja mountata lähdekoodin, mutta `compose.yaml` on git-trackattu ja jaettu tuotantodeployn kanssa.

## Ratkaisu
**docker-compose.override.yaml yhdistetään automaattisesti paikallisiin dev-muutoksiin.**

```yaml
# docker-compose.override.yaml (gitignore tai paikallinen)
services:
  api:
    ports:
      - "3000:8080"
    volumes:
      - ./src:/app/src
```

Compose merges override file automatically — compose merge.

## Käytännössä
`.gitignore` override-tiedosto tai `compose.override.example` repossa. Tuotanto käyttää vain `compose.yaml` + env-spesifistä tiedostoa.

[Lue lisää](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
