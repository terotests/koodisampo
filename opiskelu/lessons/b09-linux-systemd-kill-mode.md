# Palvelu spawnnaa child-prosesseja — stop jättää zombie-prosesseja. KillMode-korjaus?

## Tilanne

`app.service` käynnistää pääprosessin, joka forkkaa workerit:

```
PID 1000  /usr/bin/app (main)
PID 1001  /usr/bin/app worker
PID 1002  /usr/bin/app worker
```

`systemctl stop app` tappaa vain pääprosessin (oletus `KillMode=mixed` tai `control-group` riippuen versiosta). Workerit jäävät roikkumaan — portit varattuina, zombie-prosesseja `ps`-listassa.

## Ratkaisu

Aseta **`KillMode=control-group`** — **tappaa koko cgroupin prosessit stopissa**.

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

Jos sovellus tarvitsee graceful shutdown, käsittele SIGTERM pääprosessissa ja terminoi workerit siististi — KillMode=control-group on viimeinen varmistus.

`KillMode=process` tappaa vain pääprosessin — sopii vain single-process-palveluille. Deploy-testi: stop → tarkista ei orphan → start uudelleen.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.kill.html#KillMode=)
