# Bind mount ./config:/app/config — kontti ei saa kirjoittaa. Mikä on tyypillinen syy?

## Tilanne

Kehityksessä mounttaat konfiguraatiokansion suoraan hostilta:

```bash
docker run -d \
  -v ./config:/app/config \
  myapp:latest
```

Sovellus yrittää kirjoittaa lokitiedostoa `/app/config/app.log` käynnistyessään, mutta lokissa näkyy:

```
Permission denied: /app/config/app.log
```

Host-kansiossa tiedostot omistaa käyttäjä `alice` (UID 1000). Kontissa prosessi pyörii käyttäjänä `appuser` (UID 65532). Bind mount ei muuta oikeuksia — se näyttää hostin filesystemin sellaisenaan kontissa.

## Ratkaisu

Tyypillinen juurisyy: **bind mountin host-UID/GID ei täsmää kontin prosessikäyttäjään**. Bind mount käyttää hostin filesystem-oikeuksia suoraan — Docker ei käännä käyttäjätunnuksia automaattisesti.

Korjaa sovittamalla oikeudet:

```bash
# Tarkista kontin käyttäjä
docker run --rm myapp:latest id

# Säädä host-kansion omistaja vastaamaan
sudo chown -R 65532:65532 ./config
```

Tai aja kontti samalla UID:llä kuin host-tiedostot:

```bash
docker run -d -u 1000:1000 -v ./config:/app/config myapp:latest
```

Compose:ssa `user: "1000:1000"` palvelun alla.

## Käytännössä

Dev-ympäristössä bind mount on kätevä, mutta tuotannossa harkitse named volumea tai init-konttia oikeuksien asettamiseen. Dokumentoi imageen valittu non-root-käyttäjä — CI-buildin ja runtime-käyttäjän täytyy täsmätä mountattujen polkujen kanssa.

[Lue lisää](https://docs.docker.com/storage/bind-mounts/)
