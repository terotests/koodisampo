# Palvelu ei käynnisty bootissa vaikka `systemctl start` toimii. Mitä unohdettiin?

## Tilanne

Uusi `metrics-agent.service` on asennettu ja testattu:

```bash
sudo systemctl start metrics-agent
curl localhost:9100/metrics   # OK
```

Rebootin jälkeen agentti puuttuu. `systemctl status metrics-agent` → `inactive (dead)`. Unit-tiedosto on kunnossa, `[Service]`-osio toimii — mutta `[Install]`-osio on tyhjä tai `enable`-komentoa ei ajettu asennuksen yhteydessä.

## Ratkaisu

Unohdettiin **`systemctl enable metrics-agent`** — se **luo wanted-by-symlinkin bootiin**.

```bash
sudo systemctl enable metrics-agent.service
```

Unit-tiedostoon tarvitaan:

```ini
[Install]
WantedBy=multi-user.target
```

Enable luo symlinkin esim. `/etc/systemd/system/multi-user.target.wants/metrics-agent.service`.

**Enable linkittää unitin targetiin — ilman sitä boot ei käynnistä palvelua.**

Varmista:

```bash
systemctl is-enabled metrics-agent
ls -la /etc/systemd/system/multi-user.target.wants/metrics-agent.service
```

## Käytännössä

Asennusohjeissa erottele selkeästi: `start` = nyt, `enable` = bootissa. CI/CD-artefaktissa tarkista molemmat. `is-enabled` on hyvä health check deployn jälkeen.

Jos enable näyttää onnistuneen mutta boot ei käynnistä, tarkista `[Install] WantedBy=` — puuttuva osio on yleisin syy.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
