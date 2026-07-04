# Lokit pitää parsia automaattisesti — plain text on hankala. journalctl output-muoto?

## Tilanne

Rakennat automaattista lokianalyysityökalua, joka etsii tiettyjä virheitä ja korreloi ne metriikoiden kanssa. journalctl:n oletustuloste on plain text:

```
Mar 15 14:30:01 host myapp[1234]: Connection timeout after 30s
```

Parserisi ei luotettavasti erota timestampia, unitia, PID:ä ja viestiä — erityisesti kun viestissä on välilyöntejä tai monirivisiä stack traceja.

## Ratkaisu

Strukturoitu output `-o`-lipulla:

```bash
journalctl -o json
journalctl -o json-pretty
```

`-o json` tuottaa yhden JSON-objektin per rivi — sopii skripteille. `-o json-pretty` on ihmisluettava. Multiple output formats including json — journalctl man.

Esimerkki skriptissä:

```bash
journalctl -u myapp.service --since "1 hour ago" -o json | \
  jq 'select(."PRIORITY" == "3") | .MESSAGE'
```

Muita hyödyllisiä muotoja: `short-iso`, `verbose`, `export` (binääri).

## Käytännössä

Automaatiossa käytä `json` (ei pretty) — pienempi ja nopeampi parsia. `export`-muoto säilyttää kaiken metadatan binäärimuodossa siirtoa varten: `journalctl -o export > backup.journal`. Testaa parserisi monirivisten viestien kanssa — stack tracet ovat yleinen sudoku.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html#-o%20--output=)
