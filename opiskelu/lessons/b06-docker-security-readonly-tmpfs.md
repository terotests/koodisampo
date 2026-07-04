# Read-only rootfs mutta app tarvitsee /tmp kirjoitusta. Miten?

## Tilanne

Turvallisuusvaatimukset pakottavat read-only root filesystemin:

```bash
docker run -d --read-only myapp:latest
```

Sovellus kaatuu käynnistyessään:

```
OSError: [Errno 30] Read-only file system: '/tmp/session-abc123'
```

Sovellus luo väliaikaistiedostoja `/tmp`-hakemistoon sessioiden ja upload-bufferien käsittelyyn. Read-only rootfs estää kaiken kirjoituksen image-kerrokseen — mukaan lukien `/tmp`.

## Ratkaisu

Yhdistä **`--read-only`** ja **`--tmpfs /tmp`** — read-only rootfs antaa kirjoitettavan scratch-alueen muistissa:

```bash
docker run -d \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  myapp:latest
```

Compose:

```yaml
services:
  api:
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=100m
```

tmpfs elää vain muistissa — tiedostot katoavat kontin pysähtyessä, mikä on usein toivottua väliaikaisdatalle. Read-only rootfs tmpfs on Dockerin suositeltu hardening-kuvio.

## Käytännössä

Kartoita kaikki kirjoituspolut ennen read-only-ottamista (`/var/run`, `/var/cache`, `/app/logs`). Lisää jokaiselle joko tmpfs tai named volume. Aseta `noexec,nosuid` tmpfs:lle turvallisuuden vuoksi — estää suoritettavien tiedostojen luonnin `/tmp`:ssä.

[Lue lisää](https://docs.docker.com/engine/containers/multi-service_container/#use-a-read-only-root-filesystem)
