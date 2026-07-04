# Bind mount host-kansiosta — kontti kirjoittaa permission denied. Juurisyy?

## Tilanne

Compose-palvelu mounttaa lokit host-kansioon:

```yaml
services:
  api:
    image: myapi:2.0
    volumes:
      - ./logs:/var/log/myapp
```

Kontti käynnistyy, mutta sovellus kaatuu:

```
ERROR: cannot open /var/log/myapp/app.log: Permission denied
```

Host-kansio `./logs` omistaa käyttäjä dev (UID 1000). Image ajaa prosessin käyttäjänä `api` (UID 10001) turvallisuussyistä. Bind mount näyttää hostin oikeudet sellaisenaan — kontti ei "näe" hostin käyttäjänimeä, vain numerot.

## Ratkaisu

**Hostin ja kontin UID/GID eivät täsmää — non-root ei omista mountattuja tiedostoja.** File permissions bind mounteissa periytyvät hostilta.

Korjaa:

```bash
mkdir -p logs
sudo chown -R 10001:10001 logs
```

Tai määrittele compose-palvelulle oikea käyttäjä:

```yaml
services:
  api:
    user: "1000:1000"
    volumes:
      - ./logs:/var/log/myapp
```

Tuotannossa init-kontti tai entrypoint-skripti voi luoda hakemiston oikeilla oikeuksilla ennen pääprosessin käynnistymistä.

## Käytännössä

Dokumentoi imageen valittu UID/GID ja varmista CI-buildin kanssa yhteensopivuus. Dev-ympäristössä bind mount on kätevä, mutta oikeuksien säätely on jatkuva kitka — tuotannossa named volume tai initContainer ratkaisee ongelman siistimmin.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/)
