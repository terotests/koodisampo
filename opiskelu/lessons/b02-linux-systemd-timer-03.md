# Cron-työ pitää siirtää systemd:ään — tarvitaan ajastus + service. Mitä luot?

## Tilanne

Vanha cron-työ siivoo väliaikaiset tiedostot:

```cron
0 4 * * 0 /usr/local/bin/cleanup.sh
```

Haluat siirtää sen systemd:ään yhtenäisyyden vuoksi — kaikki ajastetut tehtävät samassa muodossa, lokit journalissa, enable/disable yhdellä komennolla. Cron tarjoaa vain yhden rivin; systemd tarvitsee kaksi unit-tiedostoa.

## Ratkaisu

Luo **`timer.unit + service.unit` — timer triggeröi servicen**.

`cleanup.service`:

```ini
[Unit]
Description=Weekly temp cleanup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/cleanup.sh
```

`cleanup.timer`:

```ini
[Unit]
Description=Weekly cleanup Sunday 04:00

[Timer]
OnCalendar=Sun *-*-* 04:00:00

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now cleanup.timer
```

**Systemd timer korvaa cronin** — timer.unit(5) dokumentoi `OnCalendar`-syntaksin.

## Käytännössä

Timer + service -parit kannattaa pitää samassa nimialueessa (`cleanup.service` / `cleanup.timer`). `Type=oneshot` on oikea valinta skripteille, jotka suorittavat työn ja päättyvät.

Ennen cron-poistoa varmista ajastus: `systemctl list-timers cleanup.timer` ja testiajo `systemctl start cleanup.service`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)
