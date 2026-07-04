# App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus?

## Tilanne

Sovellus käynnistyy bootissa heti `network.target`:in jälkeen — verkko-rajapinta on olemassa, mutta DHCP tai routing ei ole valmis. Sovellus yrittää yhdistää ulkoiseen API:in, epäonnistuu ja systemd käynnistää sen uudelleen crash loopissa.

`network.target` ≠ verkko oikeasti käyttövalmis.

## Ratkaisu

Unit-tiedostossa:

```ini
[Unit]
Description=My App
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/myapp
```

- **`After=`** — käynnistysjärjestys: app vasta kun target on aktivoitu.
- **`Wants=`** — systemd yrittää aktivoida `network-online.target`:in.

Varmista että wait-online -palvelu on käytössä:

```bash
systemctl enable systemd-networkd-wait-online.service
# tai NetworkManager: nm-online
```

## Huomio

`Requires=` on kovempi kuin `Wants=` — epäonnistuminen pysäyttää appin. `Wants` riittää useimmiten. Älä käytä `After=network.target` alone jos sovellus tarvitsee ulkoisen yhteyden heti käynnistyksessä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html)
