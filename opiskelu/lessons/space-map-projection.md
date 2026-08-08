# Miksi karttaprojektioita tarvitaan?

## Tilanne

WGS84-lon/lat näyttää 'vinolta' kaupunkikartalla. Miksi tarvitaan TM35FIN?

## Ratkaisu

Maantieteelliset asteet eivät ole tasometrejä. **Karttaprojektio** kuvaa ellipsoidin 2D-tasolle (x, y). Jokainen projektio vääristää jotain: Mercator säilyttää kulmat, muut pinta-aloja. Suomessa ETRS-TM35FIN (EPSG:3067) on praktinen metripohjainen tasokoordinaatisto.

## Käytännössä

Älä laske 'metrietäisyyttä' suoraan asteista ilman projektiota tai geodeettista kaavaa (Vincenty/Karney).


[Lue lisää](https://proj.org/en/stable/about.html)
