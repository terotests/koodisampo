# Lokit tulvivat DEBUG-viestejä. Miten rajaat journalctl-tulosteen vain virheisiin?

## Tilanne

Kehitystiimi jätti DEBUG-loggauksen päälle tuotantoon. journalctl-tuloste on käyttökelvoton:

```bash
journalctl -u api.service -n 100
# DEBUG: request id=abc123
# DEBUG: cache lookup key=user:42
# DEBUG: sql: SELECT * FROM ...
# ERROR: database connection lost
```

Incident-triagessa tarvitset nopeasti vain virheet — ei tuhansia DEBUG-rivejä.

## Ratkaisu

```bash
journalctl -p err
```

`-p err` näyttää err-tason ja kaikki korkeammat (crit, alert, emerg). Priority filter syslog-tasoilla — journalctl -p option.

Yhdistä unitiin:

```bash
journalctl -u api.service -p err
journalctl -u api.service -p err -n 50 --no-pager
```

Nykyinen boot + virheet:

```bash
journalctl -b -p err
```

## Käytännössä

`-p err` on triage-komento, ei korjaus DEBUG-tulvaan — laske palvelun loglevel tuotannossa. `grep DEBUG` journalctl-pipessa on hitaampi ja epätarkempi kuin `-p`. Dokumentoi prioriteettitasot tiimille: err=3, crit=2, alert=1, emerg=0 syslog-numeroissa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html#-p%20--priority=)
