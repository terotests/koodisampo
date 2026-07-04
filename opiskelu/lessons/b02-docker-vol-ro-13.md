# Config mountattu containeriin — attacker ei saa muokata. Flag?

## Tilanne

Tuotantopalvelu mounttaa konfiguraation host-kansiosta:

```bash
docker run -d \
  -v /etc/myapp/config:/app/config \
  myapp:1.2.0
```

Turvallisuusarviossa todettiin: jos hyökkääjä saa shellin konttiin, hän voisi muokata `/app/config/database.yaml` ja ohjata liikenteen omaan tietokantaansa. Config-tiedostojen pitää olla vain luettavissa kontin näkökulmasta.

## Ratkaisu

Lisää **`:ro`-flag** mounttiin:

```bash
docker run -d \
  -v /host/config:/app/config:ro \
  myapp:1.2.0
```

`:ro` mount flag tekee mountista read-only — kontti voi lukea configin mutta ei kirjoittaa siihen. Compose:

```yaml
services:
  api:
    volumes:
      - /host/config:/app/config:ro
```

## Käytännössä

Käytä `:ro` kaikissa staattisissa config-mounteissa. Yhdistä `--read-only` rootfs-lukitukseen ja tmpfs `/tmp`:lle jos sovellus tarvitsee kirjoitusoikeuden väliaikaistiedostoihin. Config-päivitykset tehdään deployment-prosessissa, ei kontin sisältä.

[Lue lisää](https://docs.docker.com/engine/containers/run/#volume-read-only-mount)
