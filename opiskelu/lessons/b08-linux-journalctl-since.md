# Incidentti alkoi noin klo 14:30 — haluat lokit siitä eteenpäin. Nopein journalctl-filtteri?

## Tilanne

Käyttäjäsovellus alkoi hidastua klo 14:30. Klo 15:00 incident on vakava. Tarvitset lokit tarkasta hetkestä eteenpäin — ei koko päivän historiaa:

```bash
journalctl --since today | wc -l
# 500000+ riviä
```

Tiedät alkuajan — tarvitset nopeimman tavan rajata siihen.

## Ratkaisu

```bash
journalctl --since '2024-01-15 14:30'
journalctl --since '2024-01-15 14:30' -u myservice
```

`--since` hyväksyy absoluuttisen ajan, suhteellisen (`1 hour ago`) ja luonnollisen kielen. --since/--until filter journal entries — journalctl man.

Rajaa loppuun:

```bash
journalctl --since '2024-01-15 14:30' --until '2024-01-15 15:00' -u myservice -p err
```

## Käytännössä

Incident-triagessa kirjoita `--since` heti kun tiedät alkuajan — nopein tapa leikata melu. Yhdistä unit-suodatin aina kun mahdollista. ISO-aikaleimat (`-o short-iso`) helpottavat aikajanan correlointia muiden järjestelmien kanssa. Tallenna: `journalctl --since '...' -u myservice -o json > incident.json`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html)
