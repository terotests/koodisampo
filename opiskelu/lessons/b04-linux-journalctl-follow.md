# Haluat seurata palvelun lokia reaaliajassa tuotantodebugissa. Mikä komento?

## Tilanne

Deploy meni läpi, mutta käyttäjät raportoivat virheitä. `systemctl status palvelu.service` näyttää että prosessi pyörii, mutta et näe mitä se tekee. Erillistä lokitiedostoa ei ole — palvelu kirjoittaa stdout/stderr journaldiin:

```bash
cat /var/log/palvelu.log
# cat: /var/log/palvelu.log: No such file or directory
```

Tarvitset reaaliaikaista seurantaa deployn aikana ja sen jälkeen.

## Ratkaisu

```bash
journalctl -u palvelu.service -f
```

`-f` (follow) seuraa journald-streamiä kuten `tail -f`. journalctl -f seuraa journald-streamiä — journalctl(1).

Käytännön variantit:

```bash
# Vain virheet reaaliajassa
journalctl -u palvelu.service -f -p err

# Nykyisen bootin jälkeen + seuranta
journalctl -u palvelu.service -b -f
```

## Käytännössä

Avaa `-f`-seuranta **ennen** `systemctl restart` — näet käynnistysvirheet heti. Tuotannossa käytä aina `-u` unit-suodattimella; pelkkä `journalctl -f` tulvii koko järjestelmän lokivirralla. Ctrl+C lopettaa seurannan — se ei vaikuta palveluun.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
