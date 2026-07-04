# Incidentti — tarvitset vanhimmat lokit ensin aikajärjestyksessä. Mitä journalctl-optiota?

## Tilanne

Tuotantoincidentti alkoi tunti sitten. Analysoit tapahtumaketjua ja tarvitset lokin **kronologisessa järjestyksessä** vanhimmasta uusimpaan — oletusjärjestys näyttää uusimmat ensin:

```bash
journalctl -u myapp.service --since "1 hour ago" | head
# Mar 15 15:00:01 ... (uusin)
# Mar 15 14:59:58 ...
# Mar 15 14:59:55 ...
```

Syy-seuraus-analyysissä haluat nähdä ensimmäisen virheen ja mitä tapahtui sen jälkeen aikajärjestyksessä.

## Ratkaisu

Käännä tulostejärjestys `-r`-lipulla (reverse):

```bash
journalctl -r
journalctl -u myapp.service --since "1 hour ago" -r
```

`-r` kääntää järjestyksen — vanhin lokimerkintä ensin. journalctl output order — journalctl man.

Incident-analyysi:

```bash
journalctl -u myapp.service -b -p err -r --no-pager
```

Huom: ilman `-r` uusimmat rivit tulevat ensin (kuten `tail`).

## Käytännössä

`-r` on erityisen hyödyllinen kun viet lokit tiedostoon ja luet ne editorissa alusta — ensimmäinen rivi on tapahtumaketjun alku. Yhdistä `-r` ja `-n` harkiten: `-n 100 -r` näyttää 100 vanhinta riviä (ei uusinta). Dokumentoi tämä runbookiin — moni sekoittaa `-r` ja `-f`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
