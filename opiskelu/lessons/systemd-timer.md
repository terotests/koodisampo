# Haluat ajastaa yöllisen backup-skriptin ilman cronia. Mikä systemd-ratkaisu?

## Tilanne

Palvelimella yöllinen backup ajetaan crontabilla:

```cron
0 3 * * * /usr/local/bin/backup.sh
```

Crontab on hajallaan käyttäjäkohtaisesti, lokien keruu on erillistä (`/var/log/backup.log` rotaatioineen), eikä deploy-skripti tiedä onko ajastus oikeasti käytössä. Haluat yhtenäisen tavan: versionhallittavat unit-tiedostot, journald-lokit ja `systemctl`-hallinta.

Systemd tarjoaa cronin korvaavan mekanismin, joka integroituu suoraan init-järjestelmään.

## Ratkaisu

Luo **`.timer` unit + `.service` unit** -pari.

`/etc/systemd/system/backup.service`:

```ini
[Unit]
Description=Nightly backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

`/etc/systemd/system/backup.timer`:

```ini
[Unit]
Description=Run backup nightly at 03:00

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Aktivoi:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
systemctl list-timers backup.timer
```

**Timer aktivoi service-unitin — moderni korvike cronille.** Lokit: `journalctl -u backup.service`.

## Käytännössä

Siirrä cron → timer migraatiossa kaikki ajastukset samaan paikkaan (`/etc/systemd/system/`). `Persistent=true` varmistaa, että myöhästynyt backup ajetaan bootin jälkeen jos kone oli pois päältä ajankohtana.

Testaa ajastus ennen tuotantoa: `systemd-analyze calendar "*-*-* 03:00:00"` ja manuaalinen `systemctl start backup.service`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)
