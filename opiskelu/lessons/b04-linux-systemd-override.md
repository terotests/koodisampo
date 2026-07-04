# Haluat muuttaa vain yhden Environment-rivin vendor unitiin ilman tiedoston kopioimista. Tapaa?

## Tilanne

Paketti toimittaa `/usr/lib/systemd/system/myapp.service`:

```ini
[Service]
Environment="LOG_LEVEL=info"
ExecStart=/usr/bin/myapp
```

Tuotannossa tarvitset `LOG_LEVEL=debug` väliaikaisesti. Kopioiminen `/etc/systemd/system/myapp.service` -polkuun toimii, mutta pakettipäivitys ylikirjoittaa muutokset tai aiheuttaa driftiä. Tarvitaan pieni override ilman koko tiedoston duplikaattia.

## Ratkaisu

Käytä **`systemctl edit myapp.service`** — **drop-in override hakemistoon**.

```bash
sudo systemctl edit myapp.service
```

Avautuu editori, joka luo tiedoston:

```
/etc/systemd/system/myapp.service.d/override.conf
```

Sisältö:

```ini
[Service]
Environment="LOG_LEVEL=debug"
```

Sovella:

```bash
sudo systemctl daemon-reload
sudo systemctl restart myapp.service
```

**systemctl edit luo .d/ override — systemd.unit drop-in pattern.** Alkuperäinen vendor-tiedosto pysyy koskemattomana.

## Käytännössä

Drop-in on standarditapa kaikille vendor-unit-muutoksille — Environment, Restart, LimitNOFILE jne. Versionhallintaan voi committoida override-tiedoston Ansible/Chef-repossa.

`systemctl cat myapp.service` näyttää tehokkaan konfiguraation (base + drop-ins). Poista override: `systemctl revert myapp.service` tai poista `.d/`-hakemisto.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
