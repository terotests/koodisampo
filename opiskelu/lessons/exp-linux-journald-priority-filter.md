# Loki tulvii DEBUG-rivejä. Miten näet vain err-tason ja korkeammat yhdeltä palvelulta?

## Tilanne

Kehitysympäristössä palvelu on konfiguroitu verbosiksi — DEBUG-viestit tulvivat journaliin. Tuotantodebugissa saman palvelun loki on lukukelvoton:

```bash
journalctl -u myapp.service -n 20
# ... DEBUG: cache hit ...
# ... DEBUG: parsing request ...
# ... DEBUG: db query took 2ms ...
# ... ERROR: connection refused to payment-api
```

Virhe on siellä, mutta se hukkuu tuhansiin DEBUG-riveihin. Tarvitset vain err-tason ja korkeammat yhdeltä unitilta.

## Ratkaisu

Yhdistä unit- ja prioriteettisuodatin:

```bash
journalctl -u myapp.service -p err
```

`-p err` näyttää err-tason ja korkeammat (crit, alert, emerg). journalctl -p suodattaa syslog-prioriteetin mukaan.

Nykyisen bootin virheet:

```bash
journalctl -u myapp.service -b -p err
```

Viime tunnin virheet:

```bash
journalctl -u myapp.service -p err --since "1 hour ago"
```

## Käytännössä

Prioriteettisuodatin on parempi kuin `grep ERROR`, koska structured logging voi käyttää eri kenttiä. Jos DEBUG-tulva jatkuu tuotannossa, korjaa lähde: vähennä palvelun logleveliä tai ota käyttöön journald rate limiting. `-p err` on triage-komento, ei pysyvä ratkaisu lokitulvaan.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
