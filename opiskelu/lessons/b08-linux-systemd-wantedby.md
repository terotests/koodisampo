# Uusi service-unit ei käynnisty bootissa vaikka enabled. Install-osiossa puuttuu?

## Tilanne

Deploy-skripti raportoi:

```
systemctl enable newservice.service → OK
```

Bootin jälkeen:

```bash
systemctl status newservice
# inactive (dead)
```

Unit-tiedosto on `/etc/systemd/system/newservice.service`, mutta `[Install]`-osio puuttuu — enable ei voi luoda symlinkkiä mihinkään targetiin.

## Ratkaisu

Lisää Install-osioon **`WantedBy=multi-user.target`** — **enable luo symlinkin oikeaan targetiin**.

```ini
[Unit]
Description=New service

[Service]
ExecStart=/usr/bin/newservice

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable newservice.service
systemctl is-enabled newservice
```

**Install section links unit to target** — ilman `WantedBy=` boot ei aktivoi unitia vaikka `start` toimisi.

## Käytännössä

Tarkista deployn jälkeen symlink:

```bash
systemctl show newservice -p WantedBy
ls -la /etc/systemd/system/multi-user.target.wants/
```

CI-testi: reboot tai `systemctl isolate multi-user.target` ja varmista palvelu ylhäällä. Template `@.service` -unitit: enable instanssille `newservice@1.service`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html#%5BInstall%5D%20Section%20Options)
