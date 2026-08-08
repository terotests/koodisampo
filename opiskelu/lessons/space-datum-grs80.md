# Miten GRS80 liittyy WGS84-ellipsoidiin?

## Tilanne

ETRS89-dokumentti mainitsee GRS80:n, GPS WGS84:n. Pitääkö muunnella metrejä?

## Ratkaisu

**GRS80** ja **WGS84-ellipsoidi** jakavat saman a:n; litistyneisyysero on mitättömän pieni tavallisessa GIS:ssä. Tärkeämpi ero on **datumi/epoch** (ETRS89 vs ITRF/WGS84-realisaatio), ei ellipsoidin millimetrit.

## Käytännössä

Kun PROJ kysyy ellipsoidia, GRS80 ETRS89:lle ja WGS84 GPS-datoille ovat oikeat valinnat. Älä sekoita ellipsoidia datumiin: sama ellipsoidi ≠ sama koordinaatti jos epoch/frame eroaa.


[Lue lisää](https://en.wikipedia.org/wiki/Geodetic_Reference_System_1980)
