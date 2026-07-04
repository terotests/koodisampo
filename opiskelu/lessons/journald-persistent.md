# Rebootin jälkeen vanhat lokit katoavat. Mikä journald-asetus säilyttää ne levyllä?

## Tilanne

Tuotantopalvelimella tapahtui yöllinen incident. Aamulla rebootin jälkeen yrität selvittää mitä tapahtui ennen uudelleenkäynnistystä:

```bash
journalctl --since "yesterday 22:00" --until "today 06:00"
# -- No entries --
```

Lokit ovat kadonneet rebootin yli. Oletusasetuksella journald tallentaa merkinnät vain `/run/log/journal/` -hakemistoon, joka on tmpfs — eli muistissa. Reboot tyhjentää sen.

Forensic-tarpeessa tai pitkäaikaisessa auditissa tarvitset lokien säilymisen levyllä.

## Ratkaisu

Aseta **pysyvä tallennus** `journald.conf`:ssa:

```ini
# /etc/systemd/journald.conf
[Journal]
Storage=persistent
```

Tämän jälkeen journald kirjoittaa lokit hakemistoon `/var/log/journal/`, jossa ne säilyvät rebootin yli. Persistent storage tallentaa journalin rebootin yli.

Käytännön vaiheet:

```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
journalctl --disk-usage   # varmista että levyllä on dataa
```

## Käytännössä

`Storage=persistent` on oletus monissa serveridistribuutioissa, mutta embedded- ja container-ympäristöissä se voi olla `volatile`. Tarkista aina `journalctl --verify` ja levytila ennen kuin luotat siihen, että vanhat lokit ovat saatavilla. Yhdistä pysyvään tallennukseen `SystemMaxUse=` tai `MaxRetentionSec=` — pelkkä persistent ei rajoita levykäyttöä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html)
