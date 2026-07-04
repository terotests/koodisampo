# Nginx kaatuu — haluat vain nginx-unitin virheet viime bootista. Komento?

## Tilanne

Nginx on crash loopissa — systemd käynnistää sen uudelleen toistuvasti. Tarvitset nopeasti vain nginx-unitin virheet **nykyisestä bootista**:

```bash
journalctl -p err
# Kaikkien palveluiden virheet — liikaa melua

journalctl -u nginx
# Kaikki nginx-rivit mukaan lukien INFO — liikaa
```

Tarvitset kolmen suodattimen yhdistelmän: unit, boot, prioriteetti.

## Ratkaisu

```bash
journalctl -u nginx -b -p err
```

- `-u nginx` — vain nginx-unit (`.service` valinnainen)
- `-b` — nykyinen boot
- `-p err` — err ja korkeammat (crit, alert, emerg)

-u filters by unit, -b current boot, -p priority — journalctl.

Laajennettu:

```bash
journalctl -u nginx.service -b -p err --no-pager -n 100
```

## Käytännössä

Crash loop -tilanteessa `-u nginx -b -p err` on ensimmäinen komento — näet miksi systemd restarttaa palvelua. Jos nginx kaatui edellisessä bootissa, käytä `-b -1`. Yhdistä `-f` kun korjaus on käynnissä: `journalctl -u nginx -b -f -p err`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html)
