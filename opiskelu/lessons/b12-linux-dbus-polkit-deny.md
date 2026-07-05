# Skripti kutsuu NetworkManageria dbus-send:llä ja saa `Access denied`. Todennäköisin syy?

## Tilanne

Automatisointi yrittää vaihtaa verkkoprofiilia:

```bash
dbus-send --system --print-reply \
  --dest=org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager \
  org.freedesktop.NetworkManager.Enable
```

Vastaus: `Error org.freedesktop.DBus.Error.AccessDenied`. Sama käyttäjä voi kuitenkin käyttää GUI:ta tai `nmcli`:ä onnistuneesti.

## Ratkaisu

NetworkManager, BlueZ ja ModemManager suojaavat muutoksia **polkit-säännöillä**. Skripti tarvitsee saman oikeuden kuin interaktiivinen käyttäjä — tai root/`sudo`.

Tarkista:

```bash
journalctl -u polkit --since '5 min ago'
pkaction | grep -i network
```

Ratkaisuvaihtoehdot:

- Aja skripti `sudo`:lla tai `polkit`-säännöllä `org.freedesktop.NetworkManager.network-admin`
- Käytä `nmcli`:ä, joka hoitaa auth-kyselyn oikein

**Access denied = polkit/oikeudet**, ei rikkoutunut D-Bus.

## Käytännössä

Tuotantopalvelimilla rajaa D-Bus-oikeudet tarkoituksella. Dokumentoi mitkä toiminnot vaativat rootin. `busctl` ja `dbus-send` eivät näytä PIN-ikkunaa — käyttäjä ei voi hyväksyä auth_admin:ia headless-skriptissä ilman erillistä konfiguraatiota.

[Lue lisää](https://www.freedesktop.org/software/polkit/docs/latest/polkit.8.html)
