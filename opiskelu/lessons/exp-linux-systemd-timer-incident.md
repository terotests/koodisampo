# Yöllinen backup-skripti ei ajautunut cronin sijaan. Miten systemd-timer korvaa crontabin?

## Tilanne

Incident: yöllinen varmuuskopio ei ole ajettu viikkoon. Crontab oli poistunut päivityksen yhteydessä, eikä kukaan huomannut — `/var/log/backup.log` ei päivitynyt. Tiimi päättää siirtyä systemd-timereihin, jotta ajastukset ovat versionhallinnassa ja näkyvissä `systemctl list-timers` -komennolla.

Vanha cron:

```cron
15 2 * * * root /opt/backup/run.sh
```

Uusi ratkaisu pitää tarjota saman ajastuksen, journald-lokituksen ja luotettavan aktivoinnin ilman crontab-riippuvuutta.

## Ratkaisu

Luo **timer.unit + service.unit pari `OnCalendar`-ajastuksella**.

`backup.service`:

```ini
[Unit]
Description=Nightly backup job

[Service]
Type=oneshot
ExecStart=/opt/backup/run.sh
User=backup
```

`backup.timer`:

```ini
[Unit]
Description=Nightly backup at 02:15

[Timer]
OnCalendar=*-*-* 02:15:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now backup.timer
systemctl list-timers | grep backup
```

**Systemd timer + service pari on moderni cron-korvike journald-lokien kanssa.** Lokit: `journalctl -u backup.service --since yesterday`.

## Käytännössä

Migraatiossa poista vanha crontab-rivi vasta kun timer on vahvistettu tuotannossa. Aseta monitorointi timerin `LAST`-kenttään tai tarkista `journalctl` -pohjainen hälytys.

`Persistent=true` on tärkeä palvelimille, jotka eivät ole 24/7 päällä — ajastus ajetaan bootin jälkeen jos ajankohta meni ohi.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)
