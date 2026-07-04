# Palvelu kaatuu satunnaisesti yöllä — haluat automaattisen uudelleenkäynnistyksen rajoitetusti. Asetus?

## Tilanne

`worker.service` kaatuu harvoin — kerran viikossa yöllä. Ilman restartia se on aamulla alhaalla. Pelkkä `Restart=always` bez rajaa aiheutti aiemmin crash-loopin deploy-bugin jälkeen.

Tarvitaan: automaattinen palautuminen + katto uudelleenkäynnistysyrityksille.

## Ratkaisu

Aseta **`Restart=on-failure` + `StartLimitIntervalSec`/`StartLimitBurst`**.

```ini
[Service]
ExecStart=/usr/bin/worker
Restart=on-failure
RestartSec=15
StartLimitIntervalSec=600
StartLimitBurst=5
```

**Restart-politiikka ja rate limit** — enintään 5 yritystä 10 minuutissa, sitten failed.

Nollaa manuaalisesti korjauksen jälkeen:

```bash
sudo systemctl reset-failed worker.service
sudo systemctl start worker.service
```

## Käytännössä

Tämä yhdistelmä on tuotannon oletusmalli: palautuminen transient-virheistä, suojaus loopilta pysyvän bugin aikana. Hälytä `NRestarts`-kasvusta.

`RestartSec` estää hetkellisen kuormituspiikin kaatamasta palvelimen restart-myrskyllä. Säädä arvot palvelun käynnistysajan mukaan.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Restart=)
