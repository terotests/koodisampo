# Palvelu käynnistyy ennen kuin se kuuntelee porttia — riippuvat unitit jatkavat liian aikaisin. Mikä Type= arvo auttaa?

## Tilanne

Reverse proxy odottaa backendin valmistumista:

```ini
# backend.service — Type=simple (oletus)
[Service]
ExecStart=/usr/bin/backend
```

Backend tulostaa "Starting..." ja systemd merkitsee sen aktiiviseksi. Nginx alkaa välittää liikennettä — mutta backend bindaa porttiin 9000 vasta 20 sekunnin init-jälkeen. Asiakkaat saavat connection refused -virheitä deployn aikana.

## Ratkaisu

Aseta **`Type=notify`** — palvelu ilmoittaa valmiudesta **`sd_notify`:llä**.

```ini
[Service]
Type=notify
ExecStart=/usr/bin/backend
NotifyAccess=main
TimeoutStartSec=120
```

Sovellus kutsuu valmiuden yhteydessä:

```c
sd_notify(0, "READY=1");
```

**Notify odottaa palvelun valmiussignaalia** — riippuvaiset unitit (`After=backend.service`) jatkavat vasta READY:n jälkeen.

## Käytännössä

Jos et voi muuttaa sovelluskoodia, käytä `ExecStartPost=/bin/sh -c 'until curl -sf localhost:9000/health; do sleep 1; done'` tai erillistä socket activation -mallia. Notify on kuitenkin oikea pitkän aikavälin ratkaisu.

Dokumentoi deploy-putkessa: health check odottaa `active (running)` + portti auki, ei vain systemd-tilaa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Type=)
