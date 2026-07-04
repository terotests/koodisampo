# Kontti kirjoittaa väliaikaista salaista tokenia levylle — se jää image layeriin. Ratkaisu?

## Tilanne

Sovellus hakee OAuth-tokenin käynnistyessään ja kirjoittaa sen väliaikaisesti tiedostoon:

```python
with open("/tmp/auth-token", "w") as f:
    f.write(token)
```

Dockerfile ei poista tiedostoa erikseen. Buildin aikana tai runtime-kirjoituksissa tiedosto voi päätyä image layeriin — `docker history` tai `docker save` + purku paljastaa salaisuuden. Vaikka kontti poistetaan, image säilyy registryssä tokenin kanssa.

## Ratkaisu

Käytä **tmpfs mountia** arkaluontoiselle transient datalle — se elää vain muistissa eikä persistoi:

```bash
docker run -d \
  --tmpfs /run/secrets:rw,noexec,nosuid,size=1m \
  myapp:latest
```

Compose:

```yaml
services:
  api:
    tmpfs:
      - /run/secrets:rw,noexec,nosuid,size=1m
```

tmpfs ei jää levylle — sopii väliaikaisille salaisuuksille, sessiotokeneille ja scratch-tiedostoille. Pysyvät salaisuudet kuuluvat Docker Secrets-, Vault- tai K8s Secrets -ratkaisuun, ei levylle kirjoitettuna.

## Käytännössä

Auditoi Dockerfile ja sovelluskoodi: mikään salaisuus ei saa päätyä image layeriin (`ENV`, `COPY` salaisella tiedostolla). Käytä BuildKit `--mount=type=secret` build-aikaisiin salaisuuksiin. tmpfs on viimeinen turvakerros transient datalle — ei korvaa oikeaa secret managementia.

[Lue lisää](https://docs.docker.com/storage/tmpfs/)
