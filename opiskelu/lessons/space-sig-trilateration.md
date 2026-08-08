# Miksi 3D-GNSS-paikkaan tarvitaan vähintään neljä satelliittia, ei kolme?

## Tilanne

Koulussa opetettiin että kolme palloa leikkaa pisteen. Miksi GPS tarvitsee neljännen?

## Ratkaisu

Geometrinen **trilateraatio** 3D:ssä tarvitsee kolme etäisyyttä. Käytännössä vastaanottimen kello ei ole synkassa satelliittiaikaan, joten jokainen pseudomatka sisältää yhteisen aikavirheen. Neljäs satelliitti (ja yleensä useampi) mahdollistaa **x, y, z, clock** -ratkaisun.

## Käytännössä

Jos näkyvissä on vain 3 satelliittia, jotkut vastaanottimet lukitsevat korkeuden (2D-fix) tai käyttävät inertiadataa — tarkkuus heikkenee.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Positioning)
