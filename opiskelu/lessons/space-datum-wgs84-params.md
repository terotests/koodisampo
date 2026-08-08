# Mikä on WGS84-ellipsoidin puolisuuren akselin (a) likimääräinen pituus?

## Tilanne

Lasket ECEF↔LLH-muunnosta ja tarvitset ellipsoidin parametrit. Mitkä WGS84-luvut?

## Ratkaisu

WGS84-ellipsoidi: **a = 6 378 137 m** (puolisuuri / ekvatoriaalinen akseli), **f = 1/298.257223563**, jolloin b ≈ 6 356 752.314 m. Nämä ovat määriteltyjä vakioita — älä sekoita GRS80:een (hyvin lähellä, pieni ero f:ssä).

## Käytännössä

Useimmat kirjastot (PROJ, GeographicLib) sisältävät WGS84:n. Älä kovakoodaa pyöreää 6371 km ellipsoidiin perustuvissa tarkkuuslaskuissa.


[Lue lisää](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84)
