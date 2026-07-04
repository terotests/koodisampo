# Kehityksessä tarvitaan debug-työkalukontti, tuotannossa ei. Compose-malli?

## Tilanne
Kehityksessä tarvitaan Adminer ja mailhog, tuotannossa ei. Sama compose.yml deployataan molempiin ilman erillistä tiedostoa.

## Ratkaisu
**profiles: [debug] palvelulle — aktivoitu docker compose --profile debug.**

```yaml
services:
  adminer:
    image: adminer
    profiles: [debug]
  mailhog:
    image: mailhog/mailhog
    profiles: [debug]
```

```bash
docker compose --profile debug up -d
```

Compose profiles valitsevat palveluja — docs.docker.com/compose/profiles.

## Käytännössä
Tuotanto-deploy ilman `--profile` — debug-palvelut eivät käynnisty. Dokumentoi profiilit README:ssä.

[Lue lisää](https://docs.docker.com/compose/how-tos/profiles/)
