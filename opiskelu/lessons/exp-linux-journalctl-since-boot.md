# Tuotantobugi tapahtui rebootin jälkeen. Miten suodatat vain nykyisen bootin lokit?

## Tilanne

Palvelin rebootattiin klo 08:00 korjaustoimenpiteen jälkeen. Deployn jälkeen klo 09:15 sovellus alkaa kaatua uudelleen. Vanhat lokit ennen rebootia sekoittavat kuvaa:

```bash
journalctl -u myapp.service | head
# Mar 14 23:41:02 ... (edellinen boot)
# Mar 15 08:02:11 ... (kernel reboot)
# Mar 15 09:15:33 ... (nykyinen vika)
```

Tarvitset vain nykyisen boot-session lokit — nopea incident-triage ilman historian melua.

## Ratkaisu

Rajaa nykyiseen bootiin `-b`-lipulla:

```bash
journalctl -b
journalctl -u myapp.service -b
```

Edellisen bootin lokit (jos reboot tapahtui liian aikaisin):

```bash
journalctl -b -1
journalctl -u myapp.service -b -1 -p err
```

journalctl -b rajaa nykyiseen bootiin — nopea incident-triage.

Boot-indeksit: `-b 0` = nykyinen, `-b -1` = edellinen, `-b -2` = sitä edellinen.

## Käytännössä

Pagerin herätessä ensimmäinen komento on usein `journalctl -b -p err --no-pager`. Yhdistä unit-suodatin heti: `journalctl -u myapp -b -p err`. Jos et ole varma reboot-ajankohdasta, `last reboot` tai `journalctl --list-boots` kertoo boot-sessioiden aikaleimat.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
