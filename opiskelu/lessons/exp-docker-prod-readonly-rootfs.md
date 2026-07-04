# Security review vaatii immutable root filesystemin. Mikä run-optio?

## Tilanne
Security review vaatii immutable root filesystemin tuotantokontille. Oletusasetuksella sovellus voi kirjoittaa minne tahansa image-layeriin — mukaan lukien `/etc` ja sovellusbinäärit.

## Ratkaisu
**--read-only plus tmpfs kirjoitettaville poluille kuten /tmp.**

```bash
docker run --read-only \
  --tmpfs /tmp:rw,noexec,nosuid \
  --mount type=volume,src=logs,dst=/var/log/myapp \
  myapp:prod
```

Read-only rootfs + tmpfs /tmp yms. rajoittaa persistoituja muutoksia.

## Käytännössä
Dokumentoi whitelistatut kirjoituspolut. Penetraatiotestissä yritä kirjoittaa `/etc` — sen pitää epäonnistua.

[Lue lisää](https://docs.docker.com/engine/security/)
