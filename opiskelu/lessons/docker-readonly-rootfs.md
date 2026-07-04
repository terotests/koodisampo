# Haluat rajoittaa kontin kirjoituksia levylle turvallisuussyistä. Mikä käynnistysasetus?

## Tilanne
Security review vaatii, ettei hyökkääjä voi kirjoittaa malwarea kontin filesystemiin tai muokata sovellusbinääriä ajon aikana. Oletus-kontti sallii kirjoitukset juureen (`/`).

Sovellus yrittää kirjoittaa väliaikaistiedostoja, mutta read-only -asetus estää sen — ellei kirjoituspolkuja ole erikseen sallittu.

## Ratkaisu
**docker run --read-only tmpfs-mounteilla tarvittaviin kirjoituspolkuihin.**

```bash
docker run -d --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --tmpfs /run:rw,nosuid,size=32m \
  -v app-cache:/var/cache/myapp \
  myapp:1.0
```

Read-only rootfs estää hyökkääjää muokkaamasta imagea ajon aikana.

## Käytännössä
Listaa kaikki kirjoituspolut (lokit, cache, uploadit) ennen read-only -käyttöönottoa. Compose: `read_only: true` + `tmpfs`- ja volumemääritykset. Testaa sovellus — hiljainen epäonnistuminen puuttuvaan `/tmp`:hen on yleinen.

[Lue lisää](https://docs.docker.com/engine/security/)
