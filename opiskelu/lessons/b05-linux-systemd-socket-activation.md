# Haluat käynnistää palvelun vasta kun porttiin tulee yhteys. Mikä systemd-ominaisuus?

## Tilanne

Raskas sovellus kuluttaa muistia vaikka sitä ei käytetä 23 tuntia vuorokaudessa. Nykyinen malli:

```ini
[Service]
ExecStart=/usr/bin/heavy-app
# käynnistyy bootissa, pitää portin 8080 auki turhaan
```

Halutaan lazy start: prosessi herää vasta kun asiakas yhdistää porttiin — kuten inetd/xinetd aikoinaan, mutta systemd:n natiivilla mekanismilla.

## Ratkaisu

**Socket activation — socket unit herättää service unitin.**

`heavy-app.socket`:

```ini
[Unit]
Description=Heavy app socket

[Socket]
ListenStream=8080
Accept=no

[Install]
WantedBy=sockets.target
```

`heavy-app.service`:

```ini
[Unit]
Requires=heavy-app.socket
After=heavy-app.socket

[Service]
ExecStart=/usr/bin/heavy-app
NonBlocking=true
```

```bash
sudo systemctl enable --now heavy-app.socket
# heavy-app.service ei käynnisty ennen ensimmäistä yhteyttä
```

**Socket units voivat laukaista palvelun tarpeen mukaan** — systemd.socket(5).

## Käytännössä

Socket activation sopii harvoin käytettyihin admin-UI:hin ja kehittyneisiin arkkitehtuureihin. Varmista että sovellus osaa adoptoida socketin (systemd socket passing) tai kuunnella oikeaa porttia activation jälkeen.

Monitoroi: ensimmäinen pyyntö voi olla hitaampi (cold start). `Accept=yes` vs `Accept=no` riippuu arkkitehtuurista — lue man page ennen tuotantoa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.socket.html)
