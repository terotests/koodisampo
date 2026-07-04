# Palvelu kirjoittaa stdoutiin mutta lokit eivät näy journalctl -u myapp. Todennäköisin syy?

## Tilanne

Kehittäjä ajaa sovelluksen manuaalisesti — loki näkyy terminaalissa:

```bash
./myapp
# INFO: request handled
```

Tuotannossa saman binäärin pitäisi lokittaa journaliin, mutta:

```bash
journalctl -u myapp -n 20
-- No entries --
```

Sovellus on "käynnissä", mutta lokit eivät päädy journald:hen.

## Ratkaisu

Todennäköisin syy: **palvelu ei ole systemd-hallinnassa tai stdout ei ohjaa journaliin.**

Tarkista:

```bash
systemctl is-active myapp
ps aux | grep myapp
```

Jos prosessi on käynnistetty käsin (`nohup`, screen, cron ilman journalia), systemd ei sieppaa stdoutia.

Systemd-palvelulle oletus on journal-sieppaus:

```ini
[Service]
ExecStart=/usr/bin/myapp
StandardOutput=journal
StandardError=journal
```

**systemd captures stdout/stderr by default for services** — mutta vain kun prosessi on systemd:n forkkaama.

Jos `StandardOutput=null` tai tiedostoon ilman journald-forwardia, `journalctl -u` on tyhjä.

## Käytännössä

Migratoi käynnistys: `systemctl start myapp` ei `nohup ./myapp &`. Poista vanhat cron-käynnistykset, jotka ohittavat journalin.

Jos loki menee tiedostoon (`StandardOutput=append:/var/log/myapp.log`), lue tiedosto — ei journalctl. Yhtenäistä logging-strategia tuotannossa: journal + centralized collector.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#StandardOutput=)
