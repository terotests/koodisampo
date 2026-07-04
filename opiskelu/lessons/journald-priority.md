# Lokitulva tuotannossa. Miten näytät vain virheet ja kriittiset nginx-unitilta?

## Tilanne

Tuotantopalvelin tulvii nginx-lokitusta: jokainen pyyntö tuottaa access- ja debug-rivejä journaliin. `journalctl -u nginx` palauttaa kymmeniä tuhansia rivejä — oikea virhe hukkuu meluun:

```bash
journalctl -u nginx -n 100
# Mar 15 14:02:01 web nginx[1234]: GET /health 200
# Mar 15 14:02:01 web nginx[1234]: GET /api/v1/users 200
# ... satoja INFO/DEBUG-rivejä ...
# Mar 15 14:01:58 web nginx[1234]: upstream timed out (110: Connection timed out)
```

Incidentin aikana tarvitset vain virheet (err) ja sitä korkeammat tasot (crit, alert, emerg).

## Ratkaisu

Rajaa syslog-prioriteetilla:

```bash
journalctl -u nginx -p err
```

`-p err` näyttää err-tason **ja kaikki korkeammat** — eli err, crit, alert ja emerg. Se on tehokkain tapa leikata lokitulva pois.

Viimeiset virheet:

```bash
journalctl -u nginx -p err -n 50 --no-pager
```

`-p err` rajaa prioriteetin — journald ymmärtää syslog-tasot.

## Käytännössä

Prioriteettisuodatin toimii paremmin kuin `grep -i error`, koska sovellukset voivat kirjoittaa "error" tekstinä INFO-tasolla. Tuotannossa yhdistä `-p err` boot- ja aikasuodattimiin: `journalctl -u nginx -b -p err`. Jos DEBUG-tulva tulee itse journald-konfiguraatiosta, tarkista myös palvelun oma loglevel, ei vain journalctl-suodatinta.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
