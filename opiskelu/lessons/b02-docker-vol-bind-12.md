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

**Docker Desktopin VM-tiedostojako: tarkista file sharing ja watcherin pollaus.** Vanhat `:cached`- ja `:delegated`-liput ovat nykyisessä Docker Desktopissa no-op — ne eivät muuta mitään.

Tarkista ensin, että hakemisto on jaettu Docker Desktopin File sharing -asetuksissa (macOS:llä VirtioFS). Jos tiedostot päivittyvät kontissa mutta watcher ei reagoi, inotify-tapahtumat eivät välity VM-rajan yli — ota pollaus käyttöön:

```yaml
services:
  web:
    volumes:
      - .:/app
    environment:
      - CHOKIDAR_USEPOLLING=true   # tai webpackin watchOptions.poll
```

Windows WSL2:ssa pidä projekti WSL-filesystemissa (`\\wsl$\...`), ei Windows-puolella — bind mount on huomattavasti nopeampi. Vaihtoehtoisesti Compose Watch (`develop.watch`) tai Mutagen synkronoi tiedostot erillisellä mekanismilla.

## Käytännössä

Testaa bind mount -workflow jokaisella alustalla ennen kuin standardisoit sen koko tiimille. CI ajaa Linuxilla — dev-ympäristön macOS/Windows-erot eivät näy siellä. Harkitse dev-containers- tai remote development -ratkaisua, jos synkronointi hidastaa työtä merkittävästi.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/)
