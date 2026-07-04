# Cron-korvaus: backup ajastus systemd:llä. Mitä tarvitset?

## Tilanne

Infra-tiimi standardoi ajastukset systemd-timereihin. Vanha cron-backup:

```cron
30 1 * * * /opt/backup/run.sh
```

Tarvitaan systemd-ekvivalentti: versionhallittavat unit-tiedostot, journald-loki, `systemctl list-timers` -näkyvyys.

## Ratkaisu

Tarvitset **`.timer` unit + `.service` unit — `OnCalendar=` ajastuksessa**.

`backup.service`:

```ini
[Unit]
Description=Daily backup

[Service]
Type=oneshot
ExecStart=/opt/backup/run.sh
```

`backup.timer`:

```ini
[Unit]
Description=Daily backup 01:30

[Timer]
OnCalendar=*-*-* 01:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now backup.timer
```

**Systemd timers replace cron** — timer laukaisee service-unitin ajastuksen mukaan.

## Käytännössä

Timer ilman serviceä ei tee mitään — aina pari. Service ilman timeriä ajetaan vain manuaalisesti. Molemmat `[Install]`: timer → `timers.target`.

Poista crontab-rivi vasta kun timer on vahvistettu tuotannossa vähintään yhden ajon verran. Lokit: `journalctl -u backup.service`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)
