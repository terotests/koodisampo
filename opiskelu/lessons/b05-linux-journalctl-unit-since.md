# Tuotantoincidentti — tarvitset nginx-unitin lokit viimeisen tunnin ajalta. Mikä komento?

## Tilanne

Klo 15:00 käyttäjät raportoivat 502-virheitä nginx-reverse-proxyn takaa. Incident alkoi noin tunti sitten. Et ehdi lukea koko palvelimen lokia — tarvitset vain nginx-unitin merkinnät viimeiseltä tunnilta:

```bash
journalctl --since "1 hour ago" | grep nginx
# Epätarkka — osuu kernel-riveihin ja muihin prosesseihin
```

Tarvitset tarkan unit- ja aikasuodatuksen yhdessä komennossa.

## Ratkaisu

```bash
journalctl -u nginx.service --since '1 hour ago'
```

journalctl suodattaa unitin ja ajan — journalctl man.

Virheiden nopeaan tarkistukseen:

```bash
journalctl -u nginx.service --since '1 hour ago' -p err --no-pager
```

JSON-vienti analyysiin:

```bash
journalctl -u nginx.service --since '1 hour ago' -o json-pretty > nginx-incident.json
```

## Käytännössä

Incident-tiimissä `--since '1 hour ago'` on nopea; tarkempaan ikkunaan `--since '15:00' --until '16:00'`. Yhdistä `-f` jos incident on käynnissä: `journalctl -u nginx.service --since '1 hour ago' -f`. Tallenna aina raw-loki ennen restarttia — reboot voi poistaa volatile-journalin.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
