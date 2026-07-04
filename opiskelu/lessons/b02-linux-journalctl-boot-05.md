# Palvelu kaatui eilen rebootin jälkeen — miten suodatat lokin tälle bootille?

## Tilanne

Eilen illalla tehtiin hätäreboot tuotantopalvelimelle. Tänään selvität miksi palvelu kaatui heti rebootin jälkeen. Lokivirta sisältää sekä eilisen että tämän päivän merkintöjä:

```bash
journalctl -u api.service --since yesterday | grep -i error
# Sekoittuu vanhoja virheitä ennen rebootia
```

Tarvitset lokin **tälle bootille** — eli nykyiselle boot-sessionille rebootin jälkeen.

## Ratkaisu

Käytä boot-suodatinta:

```bash
journalctl -b
journalctl -u api.service -b
```

`-b` ilman argumenttia valitsee nykyisen bootin (`-b 0`). journalctl -b valitsee boot-session — journalctl man.

Virheet tälle bootille:

```bash
journalctl -u api.service -b -p err --no-pager
```

Boot-lista:

```bash
journalctl --list-boots
#  IDX BOOT ID                          FIRST ENTRY                 LAST ENTRY
#   -1 abc123... Mon 2024-03-14 22:00   Tue 2024-03-15 07:59
#    0 def456... Tue 2024-03-15 08:00   Tue 2024-03-15 14:30
```

## Käytännössä

Incident-triagessa `-b` on nopeampi kuin manuaalinen aikaväli, jos tiedät että vika alkoi rebootin jälkeen. Jos vika oli **edellisessä** bootissa ennen rebootia, käytä `-b -1`. Dokumentoi boot-ID (`--list-boots`) incident-raporttiin — se yhdistää lokit muihin järjestelmätietoihin.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
