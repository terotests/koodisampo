# Mikä on tyypillinen suuruusluokka kuluttaja-SPP:n, SBAS/DGPS:n ja RTK fixedin vaakataarkkuudelle hyvissä oloissa?

## Tilanne

Asiakas pyytää 'GPS-tarkkuutta 1 cm' puhelin-API:lla ilman korjauspalvelua. Mitä vastaat?

## Ratkaisu

Suuruusluokat hyvissä oloissa: **SPP** metrejä, **SBAS/DGPS** noin metrin tai alle, **RTK/PPP-AR** senttejä. Puhelimen dual-frequency + sensorifuusio voi olla desimetriparhaimmillaan, mutta ei korvaa survey-RTK:ta.

## Käytännössä

Kirjaa speksiin menetelmä, DOP-raja, ympäristö ja luottamusväli (95 %). Pelkkä '1 cm GPS' ilman RTK:ta on epärealistinen.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Accuracy)
