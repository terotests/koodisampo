# Code review: DATABASE_PASSWORD Dockerfile ENV:ssä. Miksi tämä on ongelma?

## Tilanne
Dockerfile:

```dockerfile
ENV DATABASE_PASSWORD=prod_secret_2024
```

Kuka tahansa imagea pullaava näkee salasanan:`docker history --no-trunc myapp`.

## Ratkaisu
**ENV jää image-layeriin — salaisuus näkyy docker history -komennolla.**

Älä bake secrets imageen. Runtime:

```yaml
environment:
  DATABASE_PASSWORD_FILE: /run/secrets/db_password
secrets:
  - db_password
```

Älä bake secrets imageen — Docker secrets/runtime env.

## Käytännössä
BuildKit secret mount build-ajalle. Skannaa repoja `gitleaks`:illa. Rotate salasanat jos image on vuotanut.

[Lue lisää](https://docs.docker.com/build/building/secrets/)
