# Mikä on NTRIP RTK-käytössä?

## Tilanne

Rover kysyy 'NTRIP caster host + mountpoint'. Mitä olet konfiguroimassa?

## Ratkaisu

**NTRIP** kuljettaa RTCM-korjausvirtaa IP-verkon yli. **Caster** jakaa mountpointeja (tukiasemia tai verkko-RTK-tuotteita). Käyttäjä autentikoi, tilaa mountpointin, ja vastaanotin syöttää korjaukset RTK-moottoriin.

## Käytännössä

Suomessa esim. julkiset/kaupalliset palvelut tarjoavat ETRS89-pohjaisia korjauksia. Tarkista datum ja antennimalli — väärä APC-kalibrointi syö sentit.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/NTRIP)
