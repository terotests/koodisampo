# Palvelu käynnistyy ennen kuin tietokanta on valmis — yhteys epäonnistuu. Mitä unit-tiedostoon?

## Tilanne

`webapp.service` käynnistyy bootissa heti PostgreSQL-prosessin jälkeen. Prosessi on olemassa, mutta se ei vielä hyväksy yhteyksiä:

```
webapp: FATAL: the database system is starting up
webapp: Exited with code 1
```

Pelkkä `After=postgresql.service` ei riitä — se vain järjestää käynnistyksen, ei odota valmiutta.

## Ratkaisu

Lisää **`ExecStartPre`** odotusloopilla **tai `After=postgresql.service` + riippuvuus**.

Vaihtoehto 1 — odota valmiutta:

```ini
[Service]
ExecStartPre=/bin/sh -c 'until pg_isready -h localhost -p 5432; do sleep 1; done'
ExecStart=/usr/bin/webapp
```

Vaihtoehto 2 — riippuvuus:

```ini
[Unit]
After=postgresql.service
Wants=postgresql.service
Requires=postgresql.service
```

**ExecStartPre tai After/Wants riippuvuus varmistaa järjestyksen** — systemd.service(5).

Parhaiten yhdistettynä: riippuvuus + `ExecStartPre` tai sovelluksen oma retry-logiikka.

## Käytännössä

`pg_isready` on kevyt ja standardi PostgreSQL-työkalu. Aseta `TimeoutStartSec=300` hitaille recovery-booteille. Älä luota pelkkään `After=` — prosessi ≠ valmis palvelemaan.

Tuotannossa harkitse `Type=notify` PostgreSQLille (se tukee sd_notify) ja `After=`-ketjua downstream-palveluille.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
