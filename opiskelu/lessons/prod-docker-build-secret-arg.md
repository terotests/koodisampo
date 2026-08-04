# Miksi `ARG NPM_TOKEN` Dockerfilessa on huono tapa asentaa private packageja buildissä?

## Tilanne

```dockerfile
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc \
 && npm ci && rm .npmrc
```

Token annetaan `--build-arg NPM_TOKEN=...`. Ongelma: `ARG`-arvot ja niiden käyttö `RUN`-kerroksissa voivat jäädä image-historiaan, cache-metadataan tai välimuistikerroksiin. Token vuotaa helposti registryyn pushatun imagen mukana.

## Ratkaisu

Käytä BuildKit **build secrets** -mounttia — secret ei tallennu layeriin:

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=npm,target=/root/.npmrc \
    npm ci
```

```bash
docker build --secret id=npm,src=$HOME/.npmrc .
```

Token on saatavilla vain kyseisen `RUN`-askeleen aikana, ei imagen historiassa.

## Käytännössä

- Älä koskaan `ENV`/`ARG` salaisuuksia jotka päätyvät runtime-imageen.
- Multi-stage: vaikka `rm .npmrc`, layer-historia voi silti sisältää tiedoston.
- CI:ssä secrets vaultista / GitHub Actions `secrets` → `--secret`, ei build-argeina logeihin.

[Lue lisää](https://docs.docker.com/build/building/secrets/)
