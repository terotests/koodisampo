# Code review: API-avain Dockerfile ENV:ssä. Turvallisempi Compose/Swarm tapa?

## Tilanne
Code review: `ENV STRIPE_KEY=sk_live_...` Dockerfilessa. Avain pysyy image-layerissa ikuisesti — näkyy `docker history`:ssa.

## Ratkaisu
**secrets mountataan /run/secrets/ -polkuun — ei ENV:ään image-layeriin.**

```yaml
secrets:
  stripe_key:
    file: ./secrets/stripe_key
services:
  api:
    secrets: [stripe_key]
```

Sovellus lukee `/run/secrets/stripe_key` — ei build-time ENV:ää.

Docker secrets not in image layers — secrets docs.

## Käytännössä
BuildKit `RUN --mount=type=secret` build-ajan salaisuuksille. Runtime: secret manager.

[Lue lisää](https://docs.docker.com/compose/how-tos/use-secrets/)
