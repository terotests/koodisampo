# Miten PPP (Precise Point Positioning) eroaa RTK:sta?

## Tilanne

Etämaastossa ei ole NTRIP-tukiasemaa. Voiko silti päästä desimetri-/senttitasolle?

## Ratkaisu

**PPP** käyttää yhden vastaanottimen dual-frequency-mittauksia sekä **tarkkoja** satelliittiratoja ja kelloja (IGS, Galileo HAS, kaupalliset palvelut). Ei tarvita lähellä olevaa omaa tukiasemaa, mutta **konvergenssi** kestää usein 10–30+ minuuttia (PPP-AR nopeampi). RTK konvergoituu sekunneissa kun korjauslinkki toimii.

## Käytännössä

Valitse RTK kun verkko on saatavilla ja tarvitset heti cm. Valitse PPP/HAS kun olet kaukana tukiasemista. Varmista datum (ITRF/WGS84-epoch).


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Precise_Point_Positioning)
