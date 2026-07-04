# Incident: /var/log/journal täyttää levyn ja palvelin ei kirjoita uusia lokeja. Ensimmäinen toimenpide?

## Tilanne

Monitoring hälyttää: root-levy 100 % täynnä. Palvelin ei kirjoita uusia lokeja — journald on hiljentynyt. Tutkimus paljastaa syyn:

```bash
df -h /
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1        20G   20G     0 100% /

du -sh /var/log/journal
# 18G    /var/log/journal
```

Levy on täynnä journal-lokeista. Ensimmäinen askel ei ole sokea `rm -rf` — tarvitset tilannekuvan ja kestävän rajoituksen.

## Ratkaisu

**1. Arvioi tilanne:**

```bash
journalctl --disk-usage
# Archived and active journals take up 18.0G in the file system.
```

**2. Väliaikainen tilan vapautus (harkiten):**

```bash
journalctl --vacuum-size=500M
# tai: journalctl --vacuum-time=7d
```

**3. Estä toistuminen — `journald.conf`:**

```ini
[Journal]
SystemMaxUse=1G
SystemKeepFree=500M
MaxRetentionSec=30day
```

journald.conf rajoittaa levykäyttöä — disk-usage näyttää tilanteen.

```bash
sudo systemctl restart systemd-journald
```

## Käytännössä

Incident-triagessa `--disk-usage` ennen vacuumia — dokumentoi paljonko tilaa vapautui. `SystemMaxUse` on oletusarvo servereillä, mutta embedded-laitteissa se voi puuttua. Automatisoi hälytys kun `/var/log/journal` ylittää kynnyksen; älä odota että levy on täynnä ennen kuin journald lakkaa kirjoittamasta.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html)
