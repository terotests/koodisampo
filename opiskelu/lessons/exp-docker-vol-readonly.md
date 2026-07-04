# Config-volume ei saa muuttua runtime-aikana. Mikä mount-optio?

## Tilanne

Tuotantokontti lukee konfiguraation `/etc/app/config.yaml`-tiedostosta. Dev-ympäristössä mount toimi näin:

```bash
docker run -d -v app-config:/etc/app myapp:latest
```

Turvallisuusauditissa huomattiin, että kompromisoitu kontti voisi muokata konfiguraatiota — esimerkiksi vaihtaa tietokantayhteyden osoitteen tai poistaa autentikointivaatimuksia. Config ei saa muuttua kontin elinkaaren aikana.

## Ratkaisu

Lisää **`:ro`-flag** mountin loppuun — se tekee yksittäisestä mountista read-only:

```bash
docker run -d \
  -v app-config:/etc/app:ro \
  myapp:latest
```

Compose:

```yaml
services:
  api:
    volumes:
      - app-config:/etc/app:ro

volumes:
  app-config:
```

Kontti voi lukea tiedostoja, mutta kirjoitusyritykset epäonnistuvat. Volume-mount `:ro`-flag tekee mountista read-only ilman erillistä filesystem-muutosta.

## Käytännössä

Käytä `:ro` kaikissa config- ja secret-mounteissa, joita sovellus vain lukee. Päivitykset tehdään uudella volumella tai uudelleenkäynnistyksellä — ei runtime-kirjoituksella. Yhdistä `read_only: true` rootfs-hardeningiin kun koko kontti on lukittu.

[Lue lisää](https://docs.docker.com/storage/volumes/)
