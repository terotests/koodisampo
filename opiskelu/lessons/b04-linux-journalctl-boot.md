# Palvelin kaatui yöllä rebootiin — haluat lokit vain viime bootista. journalctl-lippu?

## Tilanne

Palvelin reboottautui yöllä odottamatta — kernel panic tai OOM. Aamulla selvität syytä. Lokivirta kattaa viikkojen historian:

```bash
journalctl -p err | wc -l
# 12847
```

Tarvitset lokit **viime bootista** — eli boot-sessiosta joka päättyi yölliseen rebootiin tai nykyiseen bootiin riippuen tutkimuskohteesta.

## Ratkaisu

Nykyinen boot:

```bash
journalctl -b
```

Edellinen boot (usein se oikea yöllisen rebootin aikana):

```bash
journalctl -b -1
journalctl -b -1 -p err --no-pager
```

-b rajaa nykyiseen bootiin — journalctl(1) boot indexing.

Boot-historia:

```bash
journalctl --list-boots
```

Yhdistä unit-suodatin:

```bash
journalctl -u nginx.service -b -1 -p err
```

## Käytännössä

Yöllisen rebootin tutkinnassa `-b -1` on ensimmäinen komento — se näyttää mitä tapahtui ennen kaatumista. Jos palvelin on rebootattu uudelleen aamulla, nykyinen boot (`-b` / `-b 0`) näyttää aamun tapahtumat. `--list-boots` selventää aikajanan ennen syvempää analyysiä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
