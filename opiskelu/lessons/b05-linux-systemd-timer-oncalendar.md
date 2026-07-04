# Cron-korvaaja ajaa backup-skriptin maanantaisin klo 03:00. Miten määrität systemd timerin?

## Tilanne

Vanha cron:

```cron
0 3 * * 1 /usr/local/bin/backup.sh
```

Siirretään systemd-timeriin. Tarvitaan oikea `OnCalendar`-syntaksi maanantai-aamuksi klo 03:00 — systemd.time(7) poikkeaa cron-syntaksista.

## Ratkaisu

Timer-unitissa: **`OnCalendar=Mon *-*-* 03:00:00`**

`backup.timer`:

```ini
[Unit]
Description=Monday 03:00 backup

[Timer]
OnCalendar=Mon *-*-* 03:00:00
Persistent=true
AccuracySec=1min

[Install]
WantedBy=timers.target
```

Validoi syntaksi:

```bash
systemd-analyze calendar "Mon *-*-* 03:00:00"
systemctl list-timers backup.timer
```

**systemd.timer käyttää OnCalendar-syntaksia** — systemd.time(7) dokumentoi lyhenteet (`Mon`, `*-*-*` = jokainen päivä).

Parina `backup.service` (`Type=oneshot`).

## Käytännössä

Useita ajastuksia: useampi `OnCalendar=`-rivi samassa timerissä tai erilliset timer-unitit. `Persistent=true` ajaa myöhästyneen ajon bootissa.

Testaa ennen tuotantoa: siirrä kello testiin lähelle tai käytä `OnCalendar=*-*-* 03:00:00` tilapäisesti ja `systemctl start backup.timer`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.timer.html#OnCalendar=)
