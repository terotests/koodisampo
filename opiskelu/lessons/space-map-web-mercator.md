# Mikä on Web Mercator (EPSG:3857) ja mikä sen sudenkuoppa?

## Tilanne

Lasket pinta-alan Leaflet-kartalla EPSG:3857-koordinaateista Lapissa. Tulos tuntuu väärältä.

## Ratkaisu

**Web Mercator** (EPSG:3857) on Pseudo-Mercator selainkarttoihin. Se säilyttää muodot paikallisesti mutta **venyttää** pohjoista: mittakaava kasvaa leveysasteen mukaan. Älä käytä sitä virallisiin pinta-aloihin tai rakentamismittauksiin — käytä TM35FIN / geodeettisia kaavoja.

## Käytännössä

Säilytä lähdedata ETRS89/WGS84-asteina tai TM35FIN-metreinä. Projektoi 3857:ään vain visualisointiin.


[Lue lisää](https://proj.org/en/stable/operations/projections/webmerc.html)
