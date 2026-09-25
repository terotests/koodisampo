# Konttilokit katoavat, kun kontti poistetaan ja luodaan uudelleen deployssa. Miten varmistat lokien keräyksen?

## Tilanne
Oletus-json-file-driver tallentaa lokit kontin hakemistoon `/var/lib/docker/containers/`. Ne säilyvät rebootin yli, mutta poistuvat kontin mukana — kun deploy korvaa kontin uudella, vanhat lokit katoavat.

Dev-ympäristössä `docker logs` riittää, mutta tuotannossa lokit pitää kerätä kontin ulkopuolelle.

## Ratkaisu
**Ulkoinen logging driver (esim. fluentd, gelf) tai hostin lokiagentti.**

```yaml
logging:
  driver: fluentd
  options:
    fluentd-address: localhost:24224
    tag: "{{.Name}}"
```

json-file-rotaatio (`max-size`, `max-file`) rajaa levynkäytön, mutta ei säilytä lokeja kontin poiston yli. Keskitetty keräys säilyttää ne kontin elinkaaresta riippumatta.

## Käytännössä
Tuotannossa lähetä lokit keskusjärjestelmään. `docker logs` riittää devissä, ei compliance-tason auditointiin.

[Lue lisää](https://docs.docker.com/engine/logging/)
