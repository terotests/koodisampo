# Dev: koodi bind-mountattu mutta muutokset eivät näy containerissa — macOS/Windows?

## Tilanne

Kehittäjä macOS:llä mounttaa lähdekoodin konttiin live-reloadia varten:

```yaml
services:
  web:
    build: .
    volumes:
      - .:/app
```

Tiedostoja muokataan hostilla, mutta kontissa webpack ei huomaa muutoksia — hot reload ei laukea. Linux-kehittäjillä sama setup toimii moitteettomasti. macOS Docker Desktop käyttää Linux-VM:ää tiedostojen jakamiseen, ja tiedostojärjestelmän synkronointi hostin ja VM:n välillä aiheuttaa viiveitä tai cache-ongelmia.

## Ratkaisu

**Cached/delegated mount tai docker sync korjaa host/VM-tiedostojärjestelmäeron.** Docker Desktop macOS:lla tarjoaa mount-konsistensseja:

```yaml
volumes:
  - .:/app:cached    # macOS: host prioriteetti, nopeampi luku kontista
  - .:/app:delegated # macOS: kontti prioriteetti, nopeampi kirjoitus kontista
```

Windows WSL2:ssa pidä projekti WSL-filesystemissa (`\\wsl$\...`), ei Windows-puolella — bind mount on huomattavasti nopeampi. Vanhemmissa setupissa `docker-sync` tai Mutagen synkronoi tiedostot erillisellä prosessilla.

## Käytännössä

Testaa bind mount -workflow jokaisella alustalla ennen kuin standardisoit sen koko tiimille. CI ajaa Linuxilla — dev-ympäristön macOS/Windows-erot eivät näy siellä. Harkitse dev-containers- tai remote development -ratkaisua, jos synkronointi hidastaa työtä merkittävästi.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/)
