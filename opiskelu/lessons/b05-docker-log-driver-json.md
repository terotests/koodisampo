# Konttilokit katoavat rebootissa. Miten varmistat lokien keräyksen?

## Tilanne
Host-reboot tyhjentää konttilokit tai `/var/lib/docker` kasvaa gigatavuiksi ilman rotaatiota.

Dev-ympäristössä `docker logs` riittää, mutta tuotannossa lokit katoavat rebootissa.

## Ratkaisu
**Logging driver (json-file + log rotation) tai ulkoinen driver kuten fluentd.**

```yaml
logging:
  driver: json-file
  options:
    max-size: "50m"
    max-file: "10"
```

Configure logging drivers — Docker logging docs.

## Käytännössä
Tuotannossa lähetä lokit keskusjärjestelmään. `docker logs` riittää devissä, ei compliance-tason auditointiin.

[Lue lisää](https://docs.docker.com/engine/logging/)
