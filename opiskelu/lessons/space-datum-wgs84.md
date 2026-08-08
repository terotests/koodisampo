# Mikä on WGS84?

## Tilanne

GeoJSON ja puhelimen GPS ilmoittavat WGS84-koordinaatteja. Mitä se tarkoittaa?

## Ratkaisu

**WGS 84** (World Geodetic System 1984) on GPS:n virallinen datumi: referenssiellipsoidi (a ≈ 6378137 m, f ≈ 1/298.257223563) ja kiinnitys maahan. Lon/lat WGS84:ssä ≈ EPSG:4326. Realizationit päivittyvät (G1762 jne.) ja pysyvät lähellä ITRF:ää.

## Käytännössä

Web-kartoissa WGS84 lon/lat projektoidaan usein Web Mercatoriin (EPSG:3857). Älä sekoita 'WGS84-metrejä' TM35FIN-metreihin ilman muunnosta.


[Lue lisää](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84)
