# CI merkitsee palvelun valmiiksi heti kun prosessi käynnistyy, mutta se kuuntelee porttia vasta 30 s myöhemmin. Unit-tyyppi?

## Tilanne

Uusi mikropalvelu käynnistyy systemd:n alaisuudessa. CI-deploy odottaa `systemctl is-active myservice` → `active`, lähettää liikennettä heti — ja saa connection refused. Palvelu lukee konfiguraation, yhdistää tietokantaan ja vasta sitten bindaa porttiin 8080. Prosessi on jo käynnissä, mutta ei valmis.

Oletustyyppi `Type=simple` (tai oletus) merkitsee palvelun käynnistetyksi heti kun pääprosessi on forkattu:

```ini
[Service]
ExecStart=/usr/bin/myservice
# Type=simple — systemd luulee valmiutta liian aikaisin
```

Riippuvaiset unitit ja health checkit jatkavat liian aikaisin.

## Ratkaisu

Käytä **`Type=notify`** — palvelu ilmoittaa **`sd_notify`:llä** kun valmis.

Unit:

```ini
[Service]
Type=notify
ExecStart=/usr/bin/myservice
NotifyAccess=main
```

Sovelluskoodi (esim. Go `github.com/coreos/go-systemd/v22/daemon`):

```go
// kun portti kuuntelee ja DB yhdistetty:
daemon.SdNotify(false, daemon.SdNotifyReady)
```

**Notify odottaa valmiusilmoitusta — estää liian aikaisen riippuvuuden.** Systemd pitää unitia `activating`-tilassa kunnes READY-signaali saapuu.

## Käytännössä

Ilman `sd_notify`-tukea koodissa voit käyttää `ExecStartPost` + health check -skriptiä tai `Type=forking` legacy-sovelluksille. Notify on puhtain ratkaisu moderneille palveluille.

Aseta `TimeoutStartSec=` riittäväksi — hitas käynnistys ei saa kaatua timeoutiin. Dokumentoi valmiuskriteeri: milloin READY lähetetään?

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
