# Palvelu crashaa loopissa — loki täyttyy. Miten rajoitat uudelleenkäynnistyksiä?

## Tilanne

Bugi tuotannossa: `api.service` kaatuu heti käynnistyksessä. Unitissa on `Restart=always`:

```ini
[Service]
ExecStart=/usr/bin/api
Restart=always
RestartSec=1
```

Minuutissa systemd on käynnistänyt palvelun satoja kertoja. Journal täyttyy identtisistä stack trace -riveistä, CPU kuormittuu ja oikea diagnoosi vaikeutuu. Tarvitaan katkaisin, joka pysäyttää loopin.

## Ratkaisu

Lisää unit-tiedostoon **`StartLimitIntervalSec` + `StartLimitBurst`**.

```ini
[Service]
ExecStart=/usr/bin/api
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=300
StartLimitBurst=5
```

Kun palvelu ylittää 5 epäonnistunutta käynnistystä 300 sekunnin sisällä, systemd merkitsee sen failed-tilaan ja lopettaa uudelleenkäynnistykset.

**StartLimit* estää restart-loopin** — katso `systemd.service(5)`.

Palautus manuaalisesti:

```bash
sudo systemctl reset-failed api.service
sudo systemctl start api.service
```

## Käytännössä

Aseta burst ja interval realistisiksi: liian matala estää lyhyet verkko-ongelmat, liian korkea ei suojaa lokivuodalta. Yhdistä hälytys `NRestarts`-metriikkaan tai journald-rate-limitiin.

Restart-loop on usein deploy-ongelma — rate limit suojaa infraa, mutta korjaa silti juurisyy ennen tuotantoon palautusta.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
