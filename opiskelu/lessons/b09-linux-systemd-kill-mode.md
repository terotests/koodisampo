# Palvelun unitissa on `KillMode=process` — workerit jäävät pyörimään stopin jälkeen. Mikä on turvallisempi asetus?

## Tilanne

`app.service` käynnistää pääprosessin, joka forkkaa workerit:

```
PID 1000  /usr/bin/app (main)
PID 1001  /usr/bin/app worker
PID 1002  /usr/bin/app worker
```

Unitissa on asetettu `KillMode=process`. `systemctl stop app` tappaa vain pääprosessin — workerit jäävät roikkumaan, portit varattuina.

Huom: nämä eivät yleensä ole zombie-prosesseja (exitannut prosessi, jota parent ei reapannut), vaan orpoja child-prosesseja.

systemd:n oletus on **`KillMode=control-group`**, jolloin unitin cgroupiin kuuluvat jäljellä olevat prosessit tapetaan stopissa. `KillMode=process` tappaa vain pääprosessin — sitä ei suositella useimpiin palveluihin.

## Ratkaisu

Poista `KillMode=process` tai aseta eksplisiittisesti **`KillMode=control-group`**:

```ini
[Service]
ExecStart=/usr/bin/app
KillMode=control-group
KillSignal=SIGTERM
TimeoutStopSec=30
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart app.service
# testaa:
sudo systemctl stop app.service
ps aux | grep app   # ei orphan-prosesseja
```

**KillMode määrittää mitä prosesseja pysäytetään** — control-group tappaa kaikki cgroupin jäsenet. systemd.kill(5).

## Käytännössä

Jos sovellus tarvitsee graceful shutdown, käsittele SIGTERM pääprosessissa ja terminoi workerit siististi — `KillMode=control-group` on viimeinen varmistus. Deploy-testi: stop → tarkista ei orphan → start uudelleen.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.kill.html#KillMode=)
