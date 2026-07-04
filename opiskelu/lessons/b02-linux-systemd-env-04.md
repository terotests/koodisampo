# Palvelu tarvitsee API-avaimen — kovakoodattu unit-tiedostoon. Turvallisempi systemd-tapa?

## Tilanne

Unit-tiedosto on gitissä:

```ini
[Service]
Environment="API_KEY=sk-live-abc123secret"
ExecStart=/usr/bin/myapp
```

Avain vuotaa repoon, code review -historiaan ja kaikille joilla on lukuoikeus `/etc/systemd/system/`. Tuotannossa salaisuudet eivät kuulu unit-tiedostoon — ne tarvitsevat erillisen, oikeuksiltaan rajatun tallennuksen.

## Ratkaisu

Käytä **`EnvironmentFile=-/etc/myapp/env`** tai **credentials drop-in**.

`/etc/myapp/env` (oikeudet 600, omistaja root tai palvelun käyttäjä):

```ini
API_KEY=sk-live-abc123secret
DATABASE_URL=postgres://...
```

Unit-tiedosto:

```ini
[Service]
EnvironmentFile=-/etc/myapp/env
ExecStart=/usr/bin/myapp
User=myapp
```

Etumerkki `-` tarkoittaa: älä kaada unitia jos tiedosto puuttuu (dev-ympäristö).

**EnvironmentFile erottaa salaisuudet — systemd.service best practice.**

Vaihtoehto: `LoadCredential=` (systemd 247+) tai salaus `systemd-creds`-työkalulla.

## Käytännössä

Salaisuustiedostot eivät koskaan versionhallintaan. Käytä config managementia (Ansible Vault, SOPS) ja varmista `chmod 600`. Code review skannaa `Environment=`-rivit, joissa näyttää olevan avaimia.

Tuotannossa erota dev/staging/prod env-tiedostot poluilla. `systemctl show myapp -p Environment` paljastaa arvot — rajoita pääsyä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
