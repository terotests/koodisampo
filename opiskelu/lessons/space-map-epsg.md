# Mikä on EPSG-koodi paikkatiedossa?

## Tilanne

API palauttaa 'crs: EPSG:3067'. Mitä asiakasohjelman pitää ymmärtää?

## Ratkaisu

**EPSG-koodi** yksilöi CRS:n parametrit (datumi, ellipsoidi, projektio, yksiköt). 4326 = WGS84 maantieteellinen, 3857 = Web Mercator, 3067 = ETRS-TM35FIN. Ilman koodia metriluvut ovat moniselitteisiä.

## Käytännössä

Tallenna EPSG aina metadataan. Älä arvaa projektiota tiedostonimestä.

Tarkista myös akselijärjestys: EPSG:4326 määritellään järjestyksessä lat, lon, mutta GeoJSON ja moni ohjelmisto käyttävät järjestystä lon, lat. Sekaannus siirtää pisteet väärälle puolelle maapalloa.


[Lue lisää](https://epsg.org/)
