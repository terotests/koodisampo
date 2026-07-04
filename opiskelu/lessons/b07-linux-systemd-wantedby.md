# Uusi service unit ei käynnisty bootissa vaikka enabled näyttää ok. Mitä [Install]-osiosta puuttuu?

## Tilanne

Uusi `analytics.service` on asennettu ja enabletty:

```bash
sudo systemctl enable analytics.service
systemctl is-enabled analytics
# enabled
```

Rebootin jälkeen palvelu on silti `inactive`. Unit-tiedoston `[Install]`-osio on tyhjä tai puuttuu kokonaan — `enable` ei löydä targetia, johon symlink luodaan, tai symlink osoittaa väärään paikkaan.

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

**WantedBy creates symlink for enable** — ilman tätä `systemctl enable` voi näyttää onnistuvan mutta boot-linkki puuttuu tai on väärä.

## Käytännössä

Graphical-palvelut: `WantedBy=graphical.target`. Timerit: `WantedBy=timers.target`. Valitse target stackin mukaan.

Code review -kohta jokaiselle uudelle unitille: `[Install]` + `WantedBy`. Template-unitit (`@`) tarvitsevat saman instanssikohtaisesti.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html#Install%20Section)
