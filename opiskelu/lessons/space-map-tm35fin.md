# Mikä on ETRS-TM35FIN (EPSG:3067)?

## Tilanne

Kuntakaava vaatii koordinaatit ETRS-TM35FIN-muodossa. Mitä muutat GPS-lon/latista?

## Ratkaisu

**ETRS-TM35FIN** (EPSG:3067) = ETRS89-datumi + poikittainen Mercator (TM) keskimeridiaanilla 27°E. Tuloksena easting/northing metreissä koko Suomen alueelle yhdellä vyöhykkeellä. Muunnos WGS84/ETRS89-asteista tehdään PROJ/GDAL-työkaluilla.

## Käytännössä

Tarkista myös korkeusjärjestelmä (N2000) erikseen — TM35FIN on 2D/vaaka. 3D tarvitsee geoidimuunnoksen.


[Lue lisää](https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/koordinaatit-korkeudet-ja-tarkkamittaus/koordinaattijarjestelmat)
