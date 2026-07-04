# Bind mount host-muutokset ei näy kontissa — mount propagation väärä. Mitä säätät?

## Tilanne

Infra-skripti mounttaa host-hakemiston konttiin ja odottaa, että konttiin mountatut alihakemistot näkyvät myös hostille (tai päinvastoin):

```bash
docker run -d \
  -v /host/data:/data \
  myapp:latest
```

Kontin sisällä ajetaan skripti, joka mounttaa uuden filesystemin `/data/sub`-hakemistoon. Hostilla `/host/data/sub` pysyy tyhjänä — nested mount ei näy hostin puolella. Oletusarvoisesti Docker käyttää `rprivate` propagationia, joka eristää mount-muutokset.

## Ratkaisu

Säädä **bind propagation** arvoon `rshared` tai `rslave`:

```bash
docker run -d \
  --mount type=bind,source=/host/data,target=/data,bind-propagation=rshared \
  myapp:latest
```

Compose:

```yaml
services:
  app:
    volumes:
      - type: bind
        source: /host/data
        target: /data
        bind:
          propagation: rshared
```

Bind mount propagation — `rshared` jakaa mount-muutokset molempiin suuntiin hostin ja kontin välillä. `rslave` jakaa host → kontti -suunnassa. Käytä vain kun tiedät tarvitsevasi nested mount -näkyvyyttä.

## Käytännössä

Mount propagation on harvinainen tarve — useimmat sovellukset eivät tarvitse sitä. Väärä propagation-asetus voi aiheuttaa turvallisuusriskejä (kontti voi vaikuttaa hostin mount-näkymään). Dokumentoi syy miksi poikkeat oletuksesta. Testaa Linux-hostilla — macOS Docker Desktop ei tue kaikkia propagation-asetuksia.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/#configure-bind-mount-propagation)
