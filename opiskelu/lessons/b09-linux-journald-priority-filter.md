# Incident-haku: tarvitset vain error-tason viestit viimeiseltä bootilta. Suodatin?

## Tilanne

Palvelin rebootattiin äskettäin incidentin jälkeen. Tarvitset nopean yhteenvedon: mitkä **virheet** tapahtuivat viimeisellä bootilla ennen rebootia tai nykyisellä bootilla:

```bash
journalctl -b
# Kaikki prioriteetit — tuhansia rivejä

journalctl -p err
# Kaikkien bootien virheet sekoittuvat
```

Tarvitset boot- ja prioriteettisuodattimen yhdessä.

## Ratkaisu

```bash
journalctl -b -p err
```

`-b` rajaa nykyiseen bootiin, `-p err` näyttää err-tason ja korkeammat. -p priority filter — journalctl man priority levels.

Edellinen boot:

```bash
journalctl -b -1 -p err
```

Yhdistä unitiin:

```bash
journalctl -b -p err -u myapp.service --no-pager
```

## Käytännössä

Incident-haun standardikomento: `journalctl -b -1 -p err` (edellinen boot) tai `journalctl -b -p err` (nykyinen). Kopioi runbookiin — säästää minuutteja pager-tilanteessa. Jos tuloksia ei ole, tarkista onko palvelu logittanut virheet INFO-tasolla — `-p err` ei näytä niitä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
