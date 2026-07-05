# Bugi aiheuttaa crash loopin — palvelu käynnistyy uudelleen 500 kertaa minuutissa. Mitä säädät?

## Tilanne

Tuotantoon päässyt bugi kaataa `worker.service`:n välittömästi. Konfiguraatio:

```ini
[Service]
Restart=always
RestartSec=1
```

Systemd käynnistää prosessin uudelleen joka sekunti. Minuutissa 500+ yritystä — journald täyttyy, levy I/O kuormittuu, on-call ei saa selvää viimeisestä virheestä koska loki rullaa yli.

## Ratkaisu

Säädä **`StartLimitIntervalSec` / `StartLimitBurst`** — **rajoita uudelleenkäynnistyksiä**.

```ini
[Service]
ExecStart=/usr/bin/worker
Restart=on-failure
RestartSec=10
StartLimitIntervalSec=60
StartLimitBurst=3
```

Kolmen epäonnistuneen käynnistyksen jälkeen minuutin sisällä systemd lopettaa yritykset ja merkitsee unitin failed.

**Start limit estää loputtoman crash loopin — systemd best practice.**

Nollaa ja korjaa:

```bash
sudo systemctl reset-failed worker.service
# korjaa bugi, sitten:
sudo systemctl start worker.service
```

## Käytännössä

Start limit on viimeinen puolustuslinja — monitoroi restart-määrää (`systemctl show worker -p NRestarts`) ja hälytä jo ennen burst-rajaa. Yhdistä `RestartSec`-viiveeseen eksponentiaalinen backoff jos sovellus tukee sitä.

### Incidentin jälkeen: tallenna loki ennen reset-failed

`systemctl reset-failed` **ei poista** journal-lokia, mutta se nollaa yksikön failed-tilan ja käynnistyslaskurit. Sen jälkeen palvelu yleensä **käynnistetään uudelleen** — ja jos bugi on yhä tuotannossa, crash loop jatkuu heti.

Kun palvelu on yrittänyt käynnistyä satoja kertoja minuutissa, todistusaineisto katoaa käytännössä näin:

1. **Loki täyttyy identtisistä virheistä** — alkuperäinen stack trace hukkuu tuhansien samanlaisten rivien alle.
2. **journald voi tiputtaa viestejä** rate limitin (`RateLimitBurst`) tai levytilan (`SystemMaxUse`) takia — vanhemmat merkinnät poistuvat ensin.
3. **`reset-failed` + uusi start** käynnistää syklin alusta — uusi lokivirta peittää incidentin ajankohdan.

Ota snapshot **heti**, kun unit on failed-tilassa ja ennen kuin kosket palveluun:

```bash
journalctl -u worker.service -n 100 --no-pager \
  > /tmp/worker-incident-$(date +%Y%m%d-%H%M).log
```

`-n 100` näyttää viimeiset 100 riviä — usein riittää näkemään viimeisin todellinen virhe ja syy, miksi systemd lopetti yritykset. Tarkempaan ikkunaan: `--since '10 min ago' -p err`. JSON-vienti SIEM-analyysiin: `-o json-pretty`.

Vasta sen jälkeen:

```bash
sudo systemctl reset-failed worker.service
# korjaa bugi tai rollback, sitten:
sudo systemctl start worker.service
```

Ilman ennakkolokitallennusta post mortem jää arvailuksi: lokissa näkyy vain uusi crash loop, ei selkeää juurisyytä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
