# Konttilokit katoavat, kun kontti korvataan deployssa, ja oletus json-file kasvaa rajatta. Tuotantoasetus?

## Tilanne
Konttilokit katoavat, kun kontti poistetaan ja korvataan uudella deployssa — json-file-lokit poistuvat kontin mukana. Lisäksi `/var/lib/docker/containers/` kasvaa loputtomasti json-file-driverilla ilman rotaatiota.

Yksittäinen palvelu voi täyttää levyn gigatavuiksi lokidataa.

## Ratkaisu
**Keskitetty logging driver tai json-file max-size/max-file -rotaatiolla.** Rotaatio rajaa levynkäytön, mutta vain keskitetty keräys säilyttää lokit kontin poiston yli.

Daemon.json:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "5"
  }
}
```

Compose:

```yaml
logging:
  driver: fluentd
  options:
    fluentd-address: localhost:24224
```

Log driver + rotation konfiguroidaan daemon/container tasolla — docker logging docs.

## Käytännössä
Keskuslokitus (Loki, ELK, CloudWatch) tuotannossa. Varmista lokien säilytysaika compliance-vaatimusten mukaan.

[Lue lisää](https://docs.docker.com/engine/logging/)
