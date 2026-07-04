# Salaisuudet compose-pinoon — ei hardcode yamlissa. Miten injektoit?

## Tilanne
Salasanat ja API-avaimet on kovakoodattu `compose.yaml`:iin. Tiimi haluaa erottaa salaisuudet git-trackattavasta tiedostosta ilman erillistä compose-tiedostoa per ympäristö.

## Ratkaisu
**env_file tai secrets erottaa salaisuudet yamlista ulkoiseen tiedostoon.**

```yaml
services:
  api:
    env_file:
      - .env.production  # .gitignore
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password
```

Compose env_file and secrets — Docker docs compose secrets.

## Käytännössä
`.env.example` repossa ilman arvoja. Tuotannossa secret manager integraatio.

[Lue lisää](https://docs.docker.com/reference/compose-file/services/#env_file)
