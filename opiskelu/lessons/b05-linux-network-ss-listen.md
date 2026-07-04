# Portti 8080 on jo käytössä — uusi palvelu ei käynnisty. Mikä komento näyttää prosessin?

## Tilanne

Systemd yrittää käynnistää uuden web-palvelun:

```bash
systemctl start myapp
Job for myapp.service failed ...
# journal: bind: address already in use :8080
```

Vanha versio piti poistaa, mutta portti on yhä varattu.

## Ratkaisu

```bash
ss -tlnp | grep 8080
```

**ss -tlnp | grep 8080 — kuuntelevat TCP-portit + prosessi**

Tuloste kertoo PID:n ja ohjelman nimen. Sammuta oikea prosessi:

```bash
systemctl stop vanha-palvelu
# tai kill -TERM <pid>
```

## Käytännössä

`ss` kuuluu iproute2:een ja on lähes aina saatavilla. Jos grep ei löydä mitään mutta bind epäonnistuu, tarkista IPv6 (`*:8080` vs `0.0.0.0:8080`) ja TIME_WAIT — harvinaisesti SO_REUSEADDR-puuttuu. Lisää unit-tiedostoon `ExecStartPre` joka varmistaa portin vapauden staging-ympäristöissä.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
