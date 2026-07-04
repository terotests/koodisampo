# Seuraat tuotantopalvelun lokia reaaliajassa deployn aikana. Komento?

## Tilanne

Tuotantodeploy on käynnissä — `systemctl restart myservice.service` ajetaan minuutin kuluttua. Tiimi haluaa nähdä käynnistyslokit ja mahdolliset virheet **reaaliajassa** heti restartin jälkeen:

```bash
journalctl -u myservice.service -n 100
# Näyttää historian — ei seuraa uusia rivejä deployn aikana
```

Erillistä lokitiedostoa ei ole — stdout/stderr menee journaldiin. Tarvitset live-seurannan yhdelle unitille.

## Ratkaisu

```bash
journalctl -u myservice.service -f
```

`-f` seuraa uusia merkintöjä reaaliajassa deployn ajan. journalctl -f seuraa uusia merkintöjä — journalctl man.

Deploy-workflow:

```bash
# Terminaali 1 — avaa ennen restarttia
journalctl -u myservice.service -f

# Terminaali 2 — suorita deploy
sudo systemctl restart myservice.service
```

Vain virheet:

```bash
journalctl -u myservice.service -f -p err
```

## Käytännössä

Deploy-runbookissa: avaa `-f` aina ennen restarttia — käynnistysvirheet näkyvät vain hetken. Yhdistä `-b` jos haluat rajata nykyiseen bootiin: `journalctl -u myservice.service -b -f`. CI/CD-pipelinessa vastaava: `timeout 60 journalctl -u myservice.service -f --since now`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
