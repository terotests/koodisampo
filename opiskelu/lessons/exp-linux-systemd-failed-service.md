# Tuotantopalvelu on failed-tilassa rebootin jälkeen. Mikä komento näyttää miksi yksikkö kaatui?

## Tilanne

Rebootin jälkeen `curl localhost:8080` epäonnistuu. Nopea tarkistus:

```bash
systemctl is-active myapp.service
# failed
```

Palvelin on ylhäällä, mutta sovellus ei. Et tiedä vielä onko kyse konfiguraatiosta, riippuvuudesta vai sovellusvirheestä. Tarvitset sekä unitin tilan että viimeisimmät lokirivit samasta bootista.

## Ratkaisu

Aja **`systemctl status myapp.service`** ja **`journalctl -u myapp.service -b`**.

```bash
systemctl status myapp.service -l --no-pager
journalctl -u myapp.service -b -n 50 --no-pager
```

`systemctl status` näyttää active/failed-tilan, exit-koodin, viimeisimmät logirivit ja riippuvuusvirheet (`dependency` vs. `exit-code`). **`journalctl -u` antaa yksikön lokit; `-b` rajoittaa nykyiseen bootiin.**

Esimerkkitulkinta:

```
Active: failed (Result: exit-code)
Process: 1234 ExecStart=/usr/bin/myapp (code=exited, status=1/FAILURE)
```

## Käytännössä

Incident-vastauksessa aja nämä komennot ennen restartia — muuten alkuperäinen virheilmoitus ylikirjoituu. Tallenna output tikettiin. Jos status näyttää `dependency`, tarkista `systemctl list-dependencies --reverse myapp.service`.

Laajenna tarvittaessa: `journalctl -u myapp -b -p err` tai `-o json` lokien aggregointiin.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
