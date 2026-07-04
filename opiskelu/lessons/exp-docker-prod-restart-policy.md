# Tuotantokontti kaatuu yöllä eikä nouse uudelleen host-rebootin jälkeen. Mitä lisäät run-komentoon?

## Tilanne
Tuotantopalvelin rebootataan yöllä patchauksen vuoksi. Aamulla tiimi huomaa, ettei API-kontti ole käynnissä — se kaatui ennen rebootia eikä noussut takaisin, koska `docker run` ajettiin ilman restart-policyä.

## Ratkaisu
**--restart unless-stopped pitää kontin pystyssä rebootin jälkeen.**

```bash
docker run -d --restart unless-stopped \
  --name api \
  myapp:1.2.3
```

Compose:

```yaml
services:
  api:
    restart: unless-stopped
```

Restart policy pitää palvelun pystyssä — unless-stopped yleinen tuotannossa.

## Käytännössä
 `unless-stopped` eroaa `always`:sta: manuaalisesti pysäytetty kontti ei käynnisty rebootin jälkeen. Dokumentoi policy jokaiselle tuotantopalvelulle.

[Lue lisää](https://docs.docker.com/config/containers/start-containers-automatically/)
