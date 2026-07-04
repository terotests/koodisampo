# Incident: tarvitset vain virhe- ja kriittiset viestit viime tunnilta. journalctl suodatin?

## Tilanne

Monitoring hälytti tunnin sitten. Palvelimella on satoja palveluita ja lokivirta on valtava. Incident-tiimille tarvitset nopeasti vain **vakavat** viestit viimeisen tunnin ajalta:

```bash
journalctl --since "1 hour ago" | wc -l
# 245000 riviä — liikaa
```

INFO- ja DEBUG-rivit eivät kiinnosta — tarvitset err, crit, alert ja emerg.

## Ratkaisu

```bash
journalctl -p err --since '1 hour ago'
```

`-p err` sisältää err-tason **ja kaikki korkeammat**: crit, alert, emerg. `-p err` sisältää err, crit, alert, emerg — journalctl(1) priority.

Rajaa yhteen palveluun:

```bash
journalctl -u myapp.service -p err --since '1 hour ago'
```

Ilman sivutusta raportointiin:

```bash
journalctl -p err --since '1 hour ago' --no-pager -o short-iso
```

## Käytännössä

Incident-triagessa `-p err --since` on standardikombo — kopioi se runbookiin. `'1 hour ago'` ymmärtää luonnollisen kielen; tarkempaan aikaan `--since '2024-03-15 13:30:00'`. Jos tuloksia on liian vähän, tarkista ettei palvelu logita virheitä väärällä prioriteetilla (INFO + "error" tekstissä).

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
