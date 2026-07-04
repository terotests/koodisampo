# Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable tehtiin. Miten estät pysyvästi?

## Tilanne

Legacy-palvelu `legacy-api.service` piti poistaa käytöstä. Admin ajoi:

```bash
sudo systemctl stop legacy-api
sudo systemctl disable legacy-api
```

Pakettipäivitys asensi uuden unit-tiedoston ja `postinst`-skripti ajoi `systemctl enable legacy-api`. Palvelu on taas bootissa. `disable` estää vain symlinkin — paketti tai toinen admin voi enabletä uudelleen.

## Ratkaisu

Aja **`systemctl mask legacy-api.service`** — **estää käynnistyksen symlinkillä /dev/null**.

```bash
sudo systemctl stop legacy-api.service
sudo systemctl mask legacy-api.service
```

Mask luo symlinkin:

```
/etc/systemd/system/legacy-api.service → /dev/null
```

**Mask on vahvempi kuin disable** — mikään `enable` tai paketin asennus ei aktivoi unitia ennen `unmask`-komentoa.

Poista mask vasta kun palvelu oikeasti palautetaan:

```bash
sudo systemctl unmask legacy-api.service
```

## Käytännössä

Maskaa deprecated-palvelut dokumentoidusti — lisää syy runbookiin. `systemctl list-unit-files | grep masked` näyttää maskatut unitit.

Erottele mask vs. remove: jos paketti ylikirjoittaa unit-tiedoston, mask säilyy (override /dev/null -linkissä). Poista paketti kokonaan jos mahdollista — mask on väliaikainen turva.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
