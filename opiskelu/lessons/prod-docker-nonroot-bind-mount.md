# Dockerfilessa `USER appuser` mutta bind mount -hakemistoon ei voi kirjoittaa. Mikä on yleisin syy?

## Tilanne

Image ajaa ei-root-käyttäjänä (`USER appuser`, uid 10001). Bind mountaat hostilta `./data:/data`. Kontti saa `Permission denied` kirjoittaessa. Syy ei ole Dockerfilen `USER`-rivi yksin — **bind mount säilyttää hostin UID/GID-omistajuuden**. Jos host-hakemisto on `uid 1000` ja kontti on `10001`, kirjoitus epäonnistuu.

## Ratkaisu

Kohdista UID/GID:

1. Luo hostilla hakemisto oikealla uid:lla, tai
2. Buildaa käyttäjä samalla uid:lla kuin host-dev:

```dockerfile
RUN useradd -u 1000 appuser
USER appuser
```

3. Tai `chown` mountattu polku entrypointissa (vaatii tilapäisesti oikeuksia) / init-kontti.

`COPY --chown=appuser:appuser` korjaa imagen sisäiset tiedostot — ei bind mount -hostpolkua.

## Käytännössä

- Kehityksessä: sama uid hostilla ja kontissa vähentää kitkaa.
- Tuotannossa: named volume + entrypoint-chown tai CSI/PV accessModes huolellisemmin.
- Älä palaa `USER root` "korjauksena" — se kiertää turvallisuusmallin.

[Lue lisää](https://docs.docker.com/storage/bind-mounts/)
