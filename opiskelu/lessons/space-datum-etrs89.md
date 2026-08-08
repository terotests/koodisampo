# Miksi Suomessa virallisessa paikkatiedossa käytetään usein ETRS89:ää eikä suoraan 'raakaa' WGS84-hetkeä?

## Tilanne

RTK-verkko ilmoittaa ETRS89-koordinaatteja, puhelin WGS84. Ovatko ne samat metrin sisällä?

## Ratkaisu

**ETRS89** on Euroopan mannerlaattaan kiinnitetty järjestelmä (epoch 1989.0). **ITRF/WGS84** liikkuvat laattojen mukana centimetrejä vuodessa. Lyhyellä aikavälillä erot Suomessa ovat pieniä, mutta tarkkuusmittauksessa epoch ja datumi pitää dokumentoida. EUREF-FIN on Suomen realisaatio.

## Käytännössä

Muunna PROJ/epsg-koodeilla (esim. ETRS89-TM35FIN EPSG:3067). Älä oleta että 'WGS84 ≈ ETRS89' aina millimetreissä.


[Lue lisää](https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/koordinaatit-korkeudet-ja-tarkkamittaus/koordinaattijarjestelmat)
