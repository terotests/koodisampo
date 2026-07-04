# Levy täyttyy journal-lokeista embedded-laitteessa. Mitä journald.conf-asetusta säädät?

## Tilanne

Embedded-laite (IoT-gateway, edge-palvelin) on 8 GB eMMC-levyllä. `/var/log/journal` kasvaa jatkuvasti ja levy on täynnä:

```bash
df -h /
# /dev/mmcblk0p2   7.2G  7.2G     0 100% /

journalctl --disk-usage
# Archived and active journals take up 4.2G
```

Laite ei kirjoita uusia lokeja — palvelut alkavat epäonnistua hiljaa. Tarvitset kestävän levyrajoituksen pienelle levylle.

## Ratkaisu

Rajoita journald:n levykäyttöä `journald.conf`:ssa:

```ini
[Journal]
SystemMaxUse=200M
SystemKeepFree=500M
MaxRetentionSec=7day
RuntimeMaxUse=50M
```

- **SystemMaxUse=** — maksimi levytila persistent-journalille
- **MaxRetentionSec=** — vanhimpien merkintöjen poistoajan raja

journald.conf limits disk usage — journald.conf man.

Hätätilanne:

```bash
journalctl --vacuum-size=100M
sudo systemctl restart systemd-journald
```

## Käytännössä

Embedded-laitteissa aseta rajat **asennuksen yhteydessä** — älä odota täyttä levyä. `SystemKeepFree` varmistaa vapaata tilaa muulle datalle. Monitoroi `journalctl --disk-usage` keskitetysti. Harkitse lokien etälähetystä (`ForwardToSyslog` + kevyt rsyslog) ja paikallista minimaalista retentionia.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html)
