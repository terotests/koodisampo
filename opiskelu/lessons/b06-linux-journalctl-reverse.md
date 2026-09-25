# Incidentti — haluat nähdä uusimmat lokimerkinnät ensin. Mitä journalctl-optiota käytät?

## Tilanne

Tuotantoincidentti alkoi tunti sitten. Haluat nähdä heti viimeisimmät tapahtumat, mutta oletusjärjestys näyttää **vanhimmat ensin** — tuoreet virheet ovat tulosteen lopussa:

```bash
journalctl -u myapp.service --since "1 hour ago" | head
# Mar 15 14:00:02 ... (vanhin)
# Mar 15 14:00:05 ...
# Mar 15 14:00:09 ...
```

Incidentin aikana haluat nähdä ensin viimeisimmät virheet selaamatta koko tunnin lokia läpi.

## Ratkaisu

Käännä tulostejärjestys `-r`-lipulla (reverse):

```bash
journalctl -r
journalctl -u myapp.service --since "1 hour ago" -r
```

`-r` (`--reverse`) kääntää järjestyksen — uusin lokimerkintä ensin. journalctl output order — journalctl man.

Incident-analyysi:

```bash
journalctl -u myapp.service -b -p err -r --no-pager
```

Huom: ilman `-r` vanhimmat rivit tulevat ensin; journalctl käyttää oletuksena pageria ja alkaa tulosteen alusta.

## Käytännössä

`-r` on erityisen hyödyllinen kun selaat tuoretta incidenttiä — ensimmäinen rivi on viimeisin tapahtuma. `-n 100 -r` näyttää 100 uusinta riviä uusin ensin; ilman `-r`:ää `-n 100` näyttää samat rivit vanhin ensin. Dokumentoi tämä runbookiin — moni sekoittaa `-r` ja `-f`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
