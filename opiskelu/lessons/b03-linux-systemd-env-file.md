# Salaisuudet ovat suoraan unit-tiedostossa gitissä. Miten systemd hoitaa ympäristön?

## Tilanne

Tiimi versionhallitsee systemd-unitit repossa. `app.service` sisältää tuotanto-DB-salasanan:

```ini
[Service]
Environment="DB_PASSWORD=SuperSecret123"
ExecStart=/opt/app/bin/server
```

Git-historia säilyttää salasanan ikuisesti. Uusi kehittäjä kloonaa repon ja näkee tuotanto-credentialsit. Tarvitaan tapa erottaa unit-määrittely (turvallinen repoon) ja salaisuudet (vain palvelimella).

## Ratkaisu

Käytä **`EnvironmentFile=/etc/app/env`** — **erillinen tiedosto oikeuksilla 600**.

```bash
sudo install -m 600 -o root -g app /dev/stdin /etc/app/env <<'EOF'
DB_PASSWORD=SuperSecret123
DB_HOST=db.internal
EOF
```

Unit:

```ini
[Service]
EnvironmentFile=/etc/app/env
ExecStart=/opt/app/bin/server
User=app
Group=app
```

**EnvironmentFile erottaa konfiguraation** — unit repossa, salaisuudet vain palvelimella.

Lataa muutokset:

```bash
sudo systemctl daemon-reload
sudo systemctl restart app.service
```

## Käytännössä

Lisää `/etc/app/env` `.gitignore`-tyyliseen policyyn — ei koskaan committia. Käytä secrets manageria (Vault, AWS SSM) ja generoi env-tiedosto deployn yhteydessä.

Auditoi olemassa olevat unitit: `grep -r Environment= /etc/systemd/system/`. Vanhat git-commitit vaativat salasanan rotaation.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
