# Mikä on ero GPS:n ja GNSS:n välillä?

## Tilanne

Markkinointiteksti sanoo 'GPS-paikannus' vaikka laite käyttää myös Galileoaa. Miten termit erotetaan?

## Ratkaisu

**GPS** (Global Positioning System) on Yhdysvaltojen DoD:n ylläpitämä järjestelmä. **GNSS** on kattotermi kaikille globaaleille satelliittipaikannusjärjestelmille: GPS, GLONASS, Galileo, BeiDou. Puhekielessä 'GPS' tarkoittaa usein mitä tahansa satelliittipaikannusta, mutta spesifikaatioissa GNSS on oikea termi.

## Käytännössä

Kirjoita API-dokumentaatioon `gnss` kun tarkoitat monijärjestelmää; `gps` vain kun rajoitut GPS-konstellaatioon.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/GNSS)
