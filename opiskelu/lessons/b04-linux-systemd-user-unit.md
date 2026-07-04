# Kehittäjä haluaa ajaa daemonin ilman root-oikeuksia login-sessionissa. Minne unit-tiedosto?

## Tilanne

Kehittäjä tarvitsee paikallisen Redis-tyyppisen daemonin kehitystyöhön. Järjestelmätason unit vaatii root-oikeudet:

```bash
sudo systemctl start mydevd   # ei haluta
```

Halutaan ajaa daemon käyttäjän omassa systemd-instanssissa — käynnistyy loginin yhteydessä, ei vaadi sudoa start/stop-komentoihin.

## Ratkaisu

Unit-tiedosto **`~/.config/systemd/user/palvelu.service`** ja hallinta **`systemctl --user enable`**.

`~/.config/systemd/user/mydevd.service`:

```ini
[Unit]
Description=Local dev daemon

[Service]
ExecStart=/usr/local/bin/mydevd --foreground
Restart=on-failure

[Install]
WantedBy=default.target
```

Aktivoi:

```bash
systemctl --user daemon-reload
systemctl --user enable --now mydevd.service
loginctl enable-linger $USER   # käynnistyy ilman aktiivista sessiota
```

**User units ajetaan --user instanssissa** — systemd.service user mode.

## Käytännössä

`enable-linger` on tärkeä palvelimille/CI-agenteille, joissa ei ole jatkuvaa interaktiivista sessiota. User-unitit eivät näy `systemctl list-units` ilman `--user`-lippua.

Portit alle 1024 vaativat edelleen capabilityjä — käytä korkeampaa porttia devissä. Tuotantodaemonit kuuluvat system-instansseihin; user units dev/henkilökohtaiseen käyttöön.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
