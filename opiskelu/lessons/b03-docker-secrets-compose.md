# DB-salasana on compose-tiedoston environment-osiossa gitissä. Parempi tapa?

## Tilanne
`compose.yml` gitissä:

```yaml
environment:
  DATABASE_PASSWORD: supersecret123
```

Kuka tahansa repossa voi lukea salasanan — ja se voi päätyä image-historiaan jos välittyy build-vaiheessa.

## Ratkaisu
**Docker secrets / ulkoinen secret store — ei plaintext repossa.**

```yaml
services:
  db:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt  # .gitignore!
```

Secrets eivät kuulu versionhallintaan — Docker secrets / Swarm / compose secrets.

## Käytännössä
Tuotannossa Vault, AWS Secrets Manager tai SOPS. `.env` gitignoreen — käytä `.env.example` mallina.

[Lue lisää](https://docs.docker.com/compose/use-secrets/)
