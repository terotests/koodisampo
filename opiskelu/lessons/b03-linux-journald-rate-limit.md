# DoS-yritys tulvittaa journald:n identtisillä virheillä — levy täyttyy. Mitä tarkistat?

## Tilanne

Palvelin vastaanottaa DoS-yrityksen: hyökkääjä laukaisee saman virheviestin tuhansia kertoja sekunnissa. Journal täyttyy identtisillä riveillä:

```bash
journalctl -u vulnerable-app -n 5
# Mar 15 03:00:01 app[99]: ERROR: invalid token
# Mar 15 03:00:01 app[99]: ERROR: invalid token
# Mar 15 03:00:01 app[99]: ERROR: invalid token
# ... sama viesti toistuu ...

df -h /var/log/journal
# Levy kasvaa nopeasti
```

Diagnostiikka on mahdotonta — oikeat virheet hukkuvat floodiin ja levy täyttyy.

## Ratkaisu

Tarkista journald:n **rate limiting** `journald.conf`:ssa:

```ini
[Journal]
RateLimitIntervalSec=30s
RateLimitBurst=1000
```

Nämä rajoittavat saman prosessin identtisten viestien määrää aikayksikössä. Ylimenevät viestit ohitetaan ja laskuri raportoidaan.

journald rate limit leikkaa floodia — journald.conf dokumentaatio.

```bash
sudo systemctl restart systemd-journald
journalctl -t systemd-journald | grep -i rate
```

## Käytännössä

Rate limit on journald-tason suoja — korjaa myös sovelluksen logitus (älä loggaa jokaista hylättyä pyyntöä ERROR-tasolla). DoS-tilanteessa yhdistä rate limit + `SystemMaxUse=` + sovellustason throttling. Testaa rate limit stagingissa ennen tuotantoa — liian aggressiivinen asetus voi piilottaa oikeita virheitä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html)
