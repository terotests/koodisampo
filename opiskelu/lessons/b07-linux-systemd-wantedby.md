# `systemctl enable` varoittaa, ettei unitissa ole asennusohjeita, eikä palvelu käynnisty bootissa. Mitä [Install]-osiosta puuttuu?

## Tilanne

Uusi `analytics.service` on asennettu ja sitä yritetään enabloida:

```bash
sudo systemctl enable analytics.service
# The unit files have no installation config (WantedBy=, RequiredBy=, ...)
systemctl is-enabled analytics
# static
```

Rebootin jälkeen palvelu on `inactive`. Unit-tiedoston `[Install]`-osio on tyhjä tai puuttuu kokonaan — `enable` ei löydä targetia, johon symlink luotaisiin, joten mitään ei tapahdu.

```ini
[Service]
ExecStart=/usr/bin/analytics
# [Install] puuttuu!
```

## Ratkaisu

Lisää **[Install]-osioon `WantedBy=multi-user.target`** — **enable luo symlinkin boot-targetiin**.

```ini
[Install]
WantedBy=multi-user.target
```

Sitten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable analytics.service
ls /etc/systemd/system/multi-user.target.wants/analytics.service
```

**WantedBy creates symlink for enable** — ilman tätä `systemctl enable` ei luo boot-linkkiä, vaan varoittaa puuttuvista asennusohjeista ja unit jää `static`-tilaan.

## Käytännössä

Graphical-palvelut: `WantedBy=graphical.target`. Timerit: `WantedBy=timers.target`. Valitse target stackin mukaan.

Code review -kohta jokaiselle uudelle unitille: `[Install]` + `WantedBy`. Template-unitit (`@`) tarvitsevat saman instanssikohtaisesti.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Install%20Section)
