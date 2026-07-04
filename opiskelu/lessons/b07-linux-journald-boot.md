# Palvelin reboottasi — haluat edellisen bootin virhelokit. journalctl?

## Tilanne

Palvelin reboottautui äkillisesti — watchdog, kernel panic tai manuaalinen restart. Nykyinen boot on vakaa, mutta tarvitset selvittää **miksi edellinen boot kaatui**:

```bash
journalctl -p err
# Sekoittuu nykyisen bootin virheet mukaan
journalctl -b -p err
# Vain nykyinen boot — ei auta
```

Tarvitset edellisen boot-session virhelokit.

## Ratkaisu

```bash
journalctl -b -1
journalctl -b -1 -p err --no-pager
```

`-b -1` valitsee edellisen bootin journalin. journalctl -b -1 shows previous boot — journalctl man.

Boot-historia:

```bash
journalctl --list-boots
#  IDX BOOT ID                          FIRST ENTRY
#   -2 ...                               Mon 2024-03-11
#   -1 abc123                            Tue 2024-03-14 22:00
#    0 def456                            Wed 2024-03-15 08:00  (nykyinen)
```

Yhdistä unit-suodatin:

```bash
journalctl -u nginx.service -b -1 -p err
```

## Käytännössä

Edellisen bootin lokit vaativat `Storage=persistent` — volatile-journalissa `-b -1` ei toimi rebootin jälkeen. Post-mortem-runbookissa ensimmäinen askel: `--list-boots`, sitten `-b -1 -p err`. Jos bootteja on useita, `-b -2` vie kauemmas taaksepäin.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html#-b%20--boot=)
