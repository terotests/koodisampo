# Mikä on UTM-koordinaatisto?

## Tilanne

GPS näyttää UTM 35V / easting / northing. Mitä luvut ovat?

## Ratkaisu

**UTM** jakaa maan 60 vyöhykkeeseen (6° leveyttä). Kullakin vyöhykkeellä poikittainen Mercator, yksikkö metri, false easting 500 km. Suomi osuu pääosin vyöhykkeisiin 34–35. ETRS-TM35FIN on kansallinen variantti yhdellä vyöhykkeellä koko maalle.

## Käytännössä

Älä sekoita UTM-vyöhykkeitä keskenään — sama easting eri vyöhykkeellä on eri paikka. Dokumentoi EPSG-koodi.


[Lue lisää](https://proj.org/en/stable/operations/projections/utm.html)
