# Palvelu kaatuu satunnaisesti prosessivirheeseen. Mikä `Restart=` arvo on järkevin tuotantoon?

## Tilanne

Yöllä `worker.service` saa satunnaisen SIGSEGV:n ulkoisesta kirjastosta. Ilman uudelleenkäynnistysasetusta palvelu jää alhaalle — aamulla jonot ovat täynnä. Kehittäjä ehdottaa `Restart=always`, joka käynnistää prosessin uudelleen myös kun admin ajaa `systemctl stop`.

```ini
[Service]
ExecStart=/usr/bin/worker
Restart=always   # käynnistää uudelleen myös hallitun pysäytyksen jälkeen
```

Toinen vaihtoehto on jättää `Restart=` pois — silloin yksittäinen crash tappaa palvelun lopullisesti. Tuotannossa tarvitaan tasapaino: automaattinen palautuminen virheistä, mutta ei yllättäviä uudelleenkäynnistyksiä hallitun ylläpidon aikana.

## Ratkaisu

Tuotantoon järkevin oletus on **`Restart=on-failure`**.

```ini
[Service]
ExecStart=/usr/bin/worker
Restart=on-failure
RestartSec=5
```

**`on-failure` uudelleenkäynnistää vain virhetilanteissa** — ei-nollapoistumiskoodi, signaali tai time-out. Hallittu `systemctl stop` ei laukaise uudelleenkäynnistystä.

Yhdistä rate limit crash-looppien estoon:

```ini
StartLimitIntervalSec=300
StartLimitBurst=5
```

## Käytännössä

`Restart=always` sopii harvoin palvelimille, joita ylläpidetään `systemctl stop`-komennolla tai deploy-skripteillä. `on-failure` on turvallisempi oletus; `always` vain jos palvelu on aidosti idempotentti ja sen pitää pyöriä jatkuvasti riippumatta pysäytyssyystä.

Dokumentoi restart-politiikka runbookiin ja varmista monitorointi: toistuvat uudelleenkäynnistykset (`systemctl show worker -p NRestarts`) ovat hälytys, ei normaali tila.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
