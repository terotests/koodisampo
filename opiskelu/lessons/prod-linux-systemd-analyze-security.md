# Haluat arvioida unit-tiedoston eristystason ennen tuotantoon vientiä. Mikä työkalu auttaa?

## Tilanne

Unitissa on joitain hardening-asetuksia, mutta et tiedä kuinka "auki" palvelu vielä on (capabilities, filesystem, verkko). Manuaalinen checklist unohtuu. Tarvitset nopean, toistettavan arvion ennen tuotantoa.

## Ratkaisu

```bash
systemd-analyze security myapp.service
```

Työkalu pisteyttää unitin exposure-scoren ja listaa puuttuvat suositukset (`ProtectSystem`, `PrivateTmp`, `CapabilityBoundingSet`, …). Mitä matalampi riski/exposure, sitä parempi eristys — tulkitse raportti kontekstissa (verkkodaemon vs batch-job).

## Käytännössä

- Aja myös `systemd-analyze verify myapp.service` syntaksi-/polkuvirheille.
- Korjaa iteratiivisesti: yksi asetus kerrallaan, testaa palvelun toiminta.
- CI:ssä voit failata jos score ylittää kynnysarvon (tiimin sopimus).

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd-analyze.html)
