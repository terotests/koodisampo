# Mihin ENU-koordinaatistoa käytetään GNSS-/inertiasovelluksissa?

## Tilanne

Drone raportoi 'northing 12 m, easting -3 m' tukipisteestä. Mikä kehikko?

## Ratkaisu

**ENU** (East-North-Up) on paikallinen suorakulmainen kehikko: origo referenssipisteessä, akselit itään, pohjoiseen ja ylös. RTK-baselinet ja IMU-fuusio ilmaistaan usein ENU:ssa tai NED:issä. Se ei ole kansallinen tasokoordinaatisto kuten TM35FIN.

## Käytännössä

Muunna ENU ↔ ECEF rotaatiomatriisilla referenssin lat/lon perusteella. Dokumentoi origo — ilman sitä ENU-luvut ovat merkityksettömiä.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Transformations_between_ECEF_and_ENU_coordinates)
