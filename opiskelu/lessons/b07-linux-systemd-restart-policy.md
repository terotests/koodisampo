# Palvelu kaatuu satunnaisesti yöllä — aamulla se on alhaalla. Mikä Restart= arvo nostaa sen automaattisesti?

## Tilanne

`ingest.service` prosessoi yöllistä dataa. Satunnaisesti se saa SIGABRT:in riippuvuuskirjastosta klo 03:00. Ilman restart-asetusta:

```bash
# aamulla:
systemctl is-active ingest
# failed
```

Manuaalinen `systemctl start` korjaa tilanteen, mutta data on jo myöhässä. Tarvitaan automaattinen palautuminen virhetilanteissa.

## Ratkaisu

Aseta unit-tiedostoon **`Restart=on-failure`** tai **`Restart=always`**.

```ini
[Service]
ExecStart=/usr/bin/ingest
Restart=on-failure
RestartSec=30
StartLimitBurst=5
StartLimitIntervalSec=600
```

**Restart= controls automatic restart** — systemd käynnistää palvelun uudelleen kun prosessi päättyy virheeseen (`on-failure`) tai aina (`always`).

Tuotantoon suositus: `on-failure` + start limit.

## Käytännössä

`always` käynnistää uudelleen myös hallitun stopin jälkeen — harvoin toivottua tuotannossa. Yhdistä hälytys: `NRestarts > 0` yön aikana on tutkittava.

Restart ei korjaa konfiguraatiovirheitä — jos palvelu kaatuu joka käynnistyksessä, start limit pysäyttää loopin. Korjaa juurisyy ennen kuin nostat burst-rajaa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Restart=)
