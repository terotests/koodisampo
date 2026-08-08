# Mikä on geoidi?

## Tilanne

Rakennuslupaan tarvitaan korkeus 'merenpinnasta'. GNSS näyttää 45 m. Voiko lukuja käyttää suoraan?

## Ratkaisu

**Geoidi** on ekvipotentiaalipinta ≈ globaali keskimääräinen merenpinta. Ortometrinen korkeus H mitataan geoidista. GNSS mittaa ellipsoidi korkeuden h. Muunnos tarvitsee geoidiundulaation N: **H ≈ h − N**. Suomessa käytetään geoidimalleja (esim. FIN2005N00) N2000-korkeuksiin.

## Käytännössä

Älä sekoita WGS84-korkeutta N2000:een. GIS-putkessa valitse oikea vertical CRS / geoidimalli.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Geoid)
