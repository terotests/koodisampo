# Config muuttui — haluat ladata palvelun ilman katkoa. Mitä eroa on reload ja restart?

## Tilanne

Nginx-palvelimen konfiguraatio päivitetään tuotannossa. Täysi restart katkaisee aktiiviset yhteydet:

```bash
systemctl restart nginx   # kaikki yhteydet katkeavat
```

Nginx tukee signaali-pohjaista uudelleenlatausta — systemd voi hyödyntää sitä `ExecReload`-komennolla. Ero on merkittävä zero-downtime-deployissa.

## Ratkaisu

**`ExecReload` ajaa määritellyn komennon — palvelu voi jatkaa pyyntöjä.**

Unit:

```ini
[Service]
ExecStart=/usr/sbin/nginx -g 'daemon off;'
ExecReload=/bin/kill -HUP $MAINPID
```

Konfiguraation päivitys:

```bash
sudo nginx -t                    # testaa ensin
sudo systemctl reload nginx      # HUP → graceful reload
```

**ExecReload mahdollistaa graceful config-päivityksen** — vanhat worker-prosessit päättyvät luontevasti, uudet lukevat uuden konfiguraation.

`restart` tappaa prosessipuun ja katkaisee yhteydet; `reload` lähettää reload-signaalin ilman täyttä pysäytystä.

## Käytännössä

Kaikki palvelut eivät tue reloadia — tarkista sovellusdocs. Jos `ExecReload` puuttuu, `systemctl reload` epäonnistuu.

Deploy-skripti: `nginx -t && systemctl reload nginx`. Unit-tiedoston muutos (ExecStart) vaatii silti `daemon-reload` + `restart` — erottele sovellusconfig vs. systemd-unit.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#ExecReload=)
