# Backup-skripti ajetaan vain jos mount on käytettävissä. Miten unit ehto?

## Tilanne

Backup kopioi tiedostot NAS-mountille `/backup`. Jos mount epäonnistuu (verkko-ongelma, fstab-virhe), skripti kirjoittaa paikalliselle levylle ja täyttää root-partition:

```bash
df /backup
# ei mountattu — backup menee /
```

Halutaan: unit ei saa aktivoidua lainkaan ilman oikeaa mountpointia.

## Ratkaisu

Lisää unit-tiedostoon **`ConditionPathIsMountPoint=/backup`** — **estää ajon ilman mountia**.

`backup.service`:

```ini
[Unit]
Description=Backup to NAS
ConditionPathIsMountPoint=/backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

Jos `/backup` ei ole mountpoint, systemd ohittaa unitin:

```bash
systemctl start backup.service
# Unit backup.service skipped due to unmet condition
```

**Conditions gate unit activation** — systemd.unit ConditionPathIsMountPoint.

## Käytännössä

Conditions ovat "fail open" -suojia — ne eivät korvaa monitorointia mount-tilasta. Yhdistä `RequiresMountsFor=/backup` tai timer + condition.

Useita ehtoja: `ConditionPathExists=`, `ConditionVirtualization=!container`. Testaa: `systemctl start backup` sekä mountattuna että ilman — varmista odotettu skip vs. failure.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#ConditionPathIsMountPoint=)
