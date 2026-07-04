# Compose-tiedostossa debug-työkalut halutaan vain kehityksessä — ei tuotantodeployssa. Ominaisuus?

## Tilanne
Sama compose-tiedosto dev- ja prod-ympäristöön — debug-työkalut (Adminer, netshoot) eivät saa päätyä tuotantoon, mutta kehityksessä ne ovat välttämättömiä.

## Ratkaisu
**profiles: [debug] — käynnistä valinnaiset palvelut komennolla compose --profile debug.**

```yaml
services:
  debug-tools:
    image: nicolaka/netshoot
    profiles: [debug]
```

```bash
docker compose up -d              # ei debug-palveluja
docker compose --profile debug up -d
```

Compose profiles selectively enable services — Compose file reference.

## Käytännössä
Useita profiileja: `[dev, debug]`. CI deploy ilman profile-flagia.

[Lue lisää](https://docs.docker.com/compose/how-tos/profiles/)
