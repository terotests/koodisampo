# Palvelu käynnistyy manuaalisesti mutta ei bootin jälkeen. Mitä komentoa tarvitaan?

## Tilanne

Kehittäjä asentaa uuden `myapp.service`-unitin, testaa sen:

```bash
sudo systemctl start myapp.service
sudo systemctl status myapp.service   # active (running)
```

Kaikki näyttää hyvältä. Seuraavana aamuna palvelin on rebootattu päivityksen jälkeen — `myapp` ei ole käynnissä. `systemctl status myapp` näyttää `inactive (dead)`. Start toimii edelleen manuaalisesti.

Ongelma: `start` aktivoi unitin juuri nyt, mutta ei linkitä sitä mihinkään boot-targetiin. Rebootin jälkeen systemd ei tiedä, että palvelu pitäisi käynnistää.

## Ratkaisu

Tarvitaan **`systemctl enable myapp.service`**.

```bash
sudo systemctl enable myapp.service
# Created symlink /etc/systemd/system/multi-user.target.wants/myapp.service → ...
```

**Enable luo symlinkin — unit käynnistyy oikeaan targetiin bootissa.** Symlink syntyy `[Install]`-osion `WantedBy=`-rivin perusteella, esim.:

```ini
[Install]
WantedBy=multi-user.target
```

Varmista:

```bash
systemctl is-enabled myapp.service   # enabled
```

## Käytännössä

Asennusskripteissä aja aina `daemon-reload`, `enable` ja halutessa `start` erikseen — pelkkä `start` ei riitä pysyvään käyttöönottoon. CI/CD-pipelineissa tarkista `is-enabled` deployn jälkeen.

Muista myös `disable` ja `mask` erot: `disable` poistaa boot-linkin, `mask` estää käynnistyksen kokonaan. Tuotantoon mennessä varmista että `[Install]`-osio on oikein vendor-unitissa tai drop-in override -tiedostossa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemctl.html)
