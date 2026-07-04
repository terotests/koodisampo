# Rebootin jälkeen edellisen bootin lokit katoavat. Mikä journald.conf-asetus korjaa?

## Tilanne

Palvelin rebootattiin korjaustoimenpiteen jälkeen. Post-mortemissa tarvitset edellisen bootin lokit, mutta ne ovat poissa:

```bash
journalctl -b -1
# Specified boot ID doesn't exist
journalctl --list-boots
# Vain yksi boot listattuna
```

Journal on tallennettu volatile-tilaan — `/run/log/journal` tmpfs:ssä. Reboot tyhjentää historian.

## Ratkaisu

Aseta pysyvä tallennus:

```ini
# /etc/systemd/journald.conf
[Journal]
Storage=persistent
```

Lokit kirjoitetaan `/var/log/journal/` -hakemistoon ja säilyvät rebootin yli. Storage=persistent säilyttää lokit levyllä — journald.conf man.

Ota käyttöön:

```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
```

Varmista:

```bash
journalctl --disk-usage
journalctl --list-boots   # useita boot-merkintöjä rebootin jälkeen
```

## Käytännössä

Muutos vaikuttaa **vasta rebootin ja uusien merkintöjen jälkeen** — vanhoja rivejä ei palauteta. Ota persistent käyttöön kaikissa tuotantopalvelimissa, joissa post-mortem on vaatimus. Rajoita levyä `SystemMaxUse=1G` tai vastaavalla — persistent ilman rajaa voi täyttää levyn.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html#Storage=)
