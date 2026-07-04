# Rebootin jälkeen vanhat lokit katoavat — forensic-tarve. journald-muutos?

## Tilanne

Turvallisuustapahtuman tutkinnassa tarvitset lokimerkinnät ennen viime yön rebootia. Tutkija yrittää hakea eilisen aktiviteetin:

```bash
journalctl --since "2024-03-14 00:00" --until "2024-03-14 23:59"
# -- No entries --
```

Reboot tyhjensi lokit. Oletus `Storage=auto` käyttää usein volatile-tallennusta (`/run/log/journal`), joka ei säily rebootin yli. Forensic-tarve vaatii pysyvän journalin levyllä.

## Ratkaisu

Aseta `journald.conf`:ssa:

```ini
[Journal]
Storage=persistent
```

Lokit tallentuvat hakemistoon `/var/log/journal`, jossa ne säilyvät rebootin yli. persistent säilyttää lokit levyllä — journald.conf man.

Ota käyttöön:

```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
```

Forensic-tarkistus:

```bash
journalctl --list-boots    # boot-historia säilyy
journalctl -b -1           # edellisen bootin lokit
journalctl --verify        # eheyden tarkistus
```

## Käytännössä

Ota `Storage=persistent` käyttöön **ennen** incidenttiä — jälkikäteen vanhoja rivejä ei saada takaisin. Forensic-ympäristöissä yhdistä FSS-sinetöinti (`Seal=yes`) ja ulkoinen lokien varmuuskopio. Rajoita levykäyttöä `SystemMaxUse=` — forensic ei tarkoita rajatonta levyä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html)
