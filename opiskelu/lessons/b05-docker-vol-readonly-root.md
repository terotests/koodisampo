# Security hardening: kontti ei saa muokata omaa filesystemia. Mitä asetusta käytät?

## Tilanne

Turvallisuusauditissa vaaditaan, että kompromisoitu kontti ei voi kirjoittaa executable-tiedostoja filesystemiin — esimerkiksi asentaa backdoor-binäärejä `/usr/local/bin`-hakemistoon tai muokata sovelluskirjastoja.

Nykyinen kontti pyörii täysin kirjoitettavalla root filesystemilla:

```bash
docker run -d myapp:latest
# Hyökkääjä kontissa: echo malicious > /usr/local/bin/backdoor
```

## Ratkaisu

Aseta **read-only root filesystem** ja anna kirjoitusoikeus vain tarvittaviin paikkoihin tmpfs:llä:

```yaml
services:
  api:
    image: myapp:latest
    read_only: true
    tmpfs:
      - /tmp
      - /run
```

Tai `docker run`:

```bash
docker run -d \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid \
  myapp:latest
```

Read-only rootfs + tmpfs for temp — kontti ei voi muokata imagea tai asentaa pysyviä tiedostoja, mutta `/tmp` on käytettävissä väliaikaistiedostoille.

## Käytännössä

Testaa sovellus read-only-tilassa ennen tuotantoon vientiä — moni sovellus kirjoittaa odottamattomasti `/var/log`, `/var/cache` tai `/app`-hakemistoon. Lisää tarvittavat tmpfs- tai volume-mountit eksplisiittisesti. Yhdistä `:ro` config-mounteihin ja drop capabilities -asetuksiin.

[Lue lisää](https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities)
