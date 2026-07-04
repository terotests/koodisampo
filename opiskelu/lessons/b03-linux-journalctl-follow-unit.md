# Debuggaat tuotantovikaa reaaliaikaisesti yhden palvelun lokeista. journalctl-syntaksi?

## Tilanne

Tuotantopalvelu `myapp.service` alkaa palauttaa virheitä deployn jälkeen. Kollega tekee muutoksia lennossa ja sinun pitää nähdä lokivirta **reaaliajassa** — ei vanhoja rivejä, vaan uudet merkinnät heti kun ne syntyvät:

```bash
journalctl -u myapp.service
# Näyttää historian ja loppuu — ei seuraa uusia rivejä
tail -f /var/log/myapp.log
# Tiedostoa ei ole — sovellus logittaa journaldiin
```

Tarvitset tail -f -tyylisen seurannan yhdelle systemd-unitille.

## Ratkaisu

```bash
journalctl -u myapp.service -f
```

- `-u myapp.service` suodattaa unitin mukaan
- `-f` (follow) seuraa uusia journal-merkintöjä reaaliajassa

`-u suodattaa unitin mukaan, -f seuraa — journalctl man.

Rajaa virheisiin samalla:

```bash
journalctl -u myapp.service -f -p err
```

Lopeta seuranta Ctrl+C:llä.

## Käytännössä

Live-debugissa `-f` on turvallisempi kuin sovelluksen oma debug-tila tuotannossa — et muuta konfiguraatiota, vain luet journalia. Yhdistä `-f` deploy-ikkunaan: avaa terminaali ennen `systemctl restart`. Tuotannossa vältä `-f` ilman unit-suodatinta — koko järjestelmän lokivirta on liian suuri.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
