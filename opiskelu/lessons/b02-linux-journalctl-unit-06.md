# Haluat vain nginx-palvelun viimeiset virheet. Tehokkain komento?

## Tilanne

Nginx vastaa hitaasti ja monitoring näyttää 502-virheitä. Sinulla on SSH-yhteys palvelimelle ja minuutti aikaa ennen standupia. Et ehdi lukea koko lokivirtaa:

```bash
journalctl -u nginx.service
# ... tuhansia rivejä access-lokeja ...
```

Tarvitset vain viimeisimmät **virheet** nginx-unitilta — ei INFO-, ei DEBUG-rivejä.

## Ratkaisu

Yhdistä unit, prioriteetti ja rivimäärä:

```bash
journalctl -u nginx.service -p err -n 50
```

- `-u nginx.service` — vain nginx-unit
- `-p err` — err ja korkeammat (crit, alert, emerg)
- `-n 50` — viimeiset 50 riviä

journalctl -u suodattaa unitin mukaan — journalctl man.

Ilman sivutusta:

```bash
journalctl -u nginx.service -p err -n 50 --no-pager
```

## Käytännössä

`-n 50` riittää useimpiin triage-tilanteisiin; kasvata tarvittaessa. Tuotannossa yhdistä boot-suodatin jos palvelin on rebootattu: `journalctl -u nginx.service -b -p err -n 50`. Tallenna tuloste: `journalctl -u nginx.service -p err -n 50 > nginx-errors.txt`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
