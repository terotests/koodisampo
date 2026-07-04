# Debuggaat live-incidenttiä — haluat seurata uusia logirivejä reaaliajassa. journalctl?

## Tilanne

Tuotantoincidentti on käynnissä — palvelu palauttaa satunnaisia 500-virheitä. Tiimi tekee muutoksia lennossa ja sinun pitää nähdä **uudet** lokimerkinnät heti kun ne syntyvät:

```bash
journalctl -u api.service -n 50
# Näyttää 50 vanhinta/uusinta riviä ja pysähtyy
watch -n 1 'journalctl -u api.service -n 5'
# Raskas ja epätarkka — näyttää samoja rivejä uudelleen
```

Tarvitset tehokkaan reaaliaikaisen seurannan.

## Ratkaisu

```bash
journalctl -f
```

`-f` seuraa uusia journal-rivejä kuten `tail -f`. Rajaa unitiin:

```bash
journalctl -u api.service -f
journalctl -u api.service -f -p err
```

journalctl -f follows new entries — journalctl man.

Lopeta Ctrl+C — se ei keskeytä palvelua.

## Käytännössä

Live-incidentissä avaa kaksi terminaalia: toisessa `-f` kaikille virheille (`journalctl -f -p err`), toisessa unit-kohtainen seuranta. Älä käytä pelkkää `journalctl -f` tuotannossa ilman suodatinta — koko järjestelmän virta on liian suuri. Yhdistä `--since now` jos haluat vain uudet rivit session alusta: `journalctl -u api.service -f --since now`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html#-f%20--follow)
