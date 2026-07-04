# Bugi aiheuttaa crash loopin — palvelu käynnistyy uudelleen 500 kertaa minuutissa. Mitä säädät?

## Tilanne

Tuotantoon päässyt bugi kaataa `worker.service`:n välittömästi. Konfiguraatio:

```ini
[Service]
Restart=always
RestartSec=1
```

Systemd käynnistää prosessin uudelleen joka sekunti. Minuutissa 500+ yritystä — journald täyttyy, levy I/O kuormittuu, on-call ei saa selvää viimeisestä virheestä koska loki rullaa yli.

## Ratkaisu

Säädä **`StartLimitIntervalSec` / `StartLimitBurst`** — **rajoita uudelleenkäynnistyksiä**.

```ini
[Service]
ExecStart=/usr/bin/worker
Restart=on-failure
RestartSec=10
StartLimitIntervalSec=60
StartLimitBurst=3
```

Kolmen epäonnistuneen käynnistyksen jälkeen minuutin sisällä systemd lopettaa yritykset ja merkitsee unitin failed.

**Start limit estää loputtoman crash loopin — systemd best practice.**

Nollaa ja korjaa:

```bash
sudo systemctl reset-failed worker.service
# korjaa bugi, sitten:
sudo systemctl start worker.service
```

## Käytännössä

Start limit on viimeinen puolustuslinja — monitoroi restart-määrää (`systemctl show worker -p NRestarts`) ja hälytä jo ennen burst-rajaa. Yhdistä `RestartSec`-viiveeseen eksponentiaalinen backoff jos sovellus tukee sitä.

Incidentin jälkeen: `journalctl -u worker -n 100` ennen reset-failed — muuten todistusaineisto katoaa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
