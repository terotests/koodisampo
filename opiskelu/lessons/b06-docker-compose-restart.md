# Tuotantokontti pitää käynnistää automaattisesti host-rebootin jälkeen. Compose-kenttä?

## Tilanne
Tuotantokontti ei käynnisty host-rebootin jälkeen — se oli pysähtynyt ennen rebootia tai daemon ei käynnistänyt sitä uudelleen.

## Ratkaisu
**restart: unless-stopped tai always käynnistää kontin uudelleen rebootin jälkeen.**

```yaml
services:
  api:
    restart: unless-stopped
```

Compose restart policy — Docker docs compose restart.

## Käytännössä
 `unless-stopped` yleisin tuotannossa. Varmista Docker daemon `enable` systemd:llä rebootin yhteydessä.

[Lue lisää](https://docs.docker.com/reference/compose-file/services/#restart)
