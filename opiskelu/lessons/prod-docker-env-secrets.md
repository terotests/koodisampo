# Dockerfile sisältää rivin `ENV API_KEY=sk_live_...`. Mikä ongelma tuotannossa?

## Tilanne

Dockerfile rakentaa tuotantoimaget:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
ENV API_KEY=sk_live_abc123xyz
ENV DATABASE_URL=postgres://user:pass@db/prod
RUN npm ci && npm run build
CMD ["node", "dist/server.js"]
```

Image pushataan registryyn ja deployataan tuotantoon. Myöhemmin kehittäjä huomaa, että API-avain vuotanut — joku veti imagen ja luki salaisuuden:

```bash
docker history myapp:latest
docker save myapp:latest | tar xO | strings | grep sk_live
```

## Ratkaisu

**Salaisuus jää image-layeriin — älä käytä `ENV`-direktiiviä salaisuuksille.** Image layerit ovat luettavissa kaikille, joilla on pääsy registryyn.

Käytä runtime-injektiota:

```yaml
# docker compose
services:
  api:
    environment:
      API_KEY: ${API_KEY}   # .env ei versionhallintaan
    secrets:
      - api_key

secrets:
  api_key:
    file: ./secrets/api_key.txt
```

Build-aikaisiin salaisuuksiin BuildKit:

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=api_key \
    API_KEY=$(cat /run/secrets/api_key) npm run build-with-key
```

Docker secrets / K8s secrets / runtime injektio — salaisuus ei koskaan päädy image layeriin.

## Käytännössä

Auditoi Dockerfilet: poista kaikki `ENV`, `ARG` ja `COPY` salaisuuksilla. Käytä secret manageria (Vault, AWS Secrets Manager, K8s Secrets). Jos salaisuus on vuotanut imageen, rotaatio ei riitä — image pitää rebuildata ilman salaisuutta ja vanhat tagit poistaa registrystä.

[Lue lisää](https://docs.docker.com/build/building/secrets/)
