# Konttilokit katoavat rebootin jälkeen — oletus json-file kasvaa loputtomasti. Tuotanto-asetus?

## Tilanne
Konttilokit katoavat host-rebootin jälkeen tai `/var/lib/docker/containers/` kasvaa loputtomasti json-file-driverilla ilman rotaatiota.

Yksittäinen palvelu voi täyttää levyn gigatavuiksi lokidataa.

## Ratkaisu
**logging driver esim. journald/json-file max-size & max-file tai centralized driver.**

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
