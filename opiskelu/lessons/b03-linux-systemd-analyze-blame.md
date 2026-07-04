# Palvelin käynnistyy hitaasti tuotantoon noston jälkeen. Mikä systemd-komento paikantaa hitaat unitit?

## Tilanne

Uusi tuotantopalvelin on valmis, mutta boot kestää yli kaksi minuuttia. SSH on käytettävissä vasta pitkän odotuksen jälkeen. `dmesg` näyttää normaalin kernel-käynnistyksen — ongelma on käyttäjätilan palveluissa, mutta et tiedä kumpi unit syö ajan.

Tarvitset listan unit-kohtaisista viiveistä, ei arvausta.

## Ratkaisu

Aja **`systemd-analyze blame`** — se **näyttää unit-kohtaiset viiveet** bootissa.

```bash
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain
```

Esimerkkituloste:

```
    45.231s postgresql.service
    12.104s docker.service
     3.891s nginx.service
```

**systemd-analyze blame listaa boot-ajan kuluttajat** — freedesktop.org man.

`critical-chain` näyttää kriittisen polun: mikä unit odotti mitä.

## Käytännössä

Aja blame jokaisella uudella image-versiolla ja vertaa baselineen. PostgreSQLin pitkä käynnistys voi johtua recoverystä — erottele normaali vs. regressio.

Blame mittaa wall-clock-aikaa, ei CPU:a. Hidas unit voi odottaa riippuvuutta (`After=network-online.target`). Yhdistä `critical-chain`-tulokseen ennen optimointia.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd-analyze.html)
