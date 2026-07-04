# App unit käynnistää ennen tietokantaa — yhteys epäonnistuu. Miten pakotat järjestys?

## Tilanne

Boot-järjestyksessä `app.service` ja `postgresql.service` käynnistyvät rinnakkain. App kaatuu:

```
app: connection refused to localhost:5432
Active: failed (Result: exit-code)
```

Kehittäjä lisää `Requires=postgresql.service`, mutta se ei yksin takaa järjestystä — Requires aktivoi riippuvuuden, mutta rinnakkaiskäynnistys voi silti voittaa ilman `After=`.

## Ratkaisu

Lisää app-unitiin **`After=db.service`** — se **pakottaa käynnistyksen järjestyksen**.

```ini
[Unit]
Description=Application
After=postgresql.service
Wants=postgresql.service

[Service]
ExecStart=/usr/bin/app
Restart=on-failure
```

**After= pakottaa: app käynnistyy vasta kun postgresql on käynnistetty** (ei vielä takuu valmiudesta — tarvittaessa `ExecStartPre` + `pg_isready`).

Yhdistelmä tuotantoon:

```ini
After=postgresql.service
Wants=postgresql.service
```

## Käytännössä

`Requires=` + `After=` yhdessä kun DB on pakollinen ja järjestys kriittinen. Muista: `After=` ilman `Wants=`/`Requires=` ei aktivoi DB:tä ollenkaan — varmista että tietokanta on enabled.

Testaa reboot 10 kertaa peräkkäin — race conditionit ilmenevät satunnaisesti ilman systemaattista testiä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#Requires=)
