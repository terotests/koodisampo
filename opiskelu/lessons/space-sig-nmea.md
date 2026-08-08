# Mikä on NMEA 0183 GNSS-laitteissa?

## Tilanne

GPS-moduuli spekaa 'NMEA 9600 baud'. Mitä odotat UART-linjalta?

## Ratkaisu

**NMEA 0183** on ASCII-lauseprotokolla: rivit alkavat `$`-merkillä, kentät pilkulla, lopussa checksum `*HH`. Yleisiä lauseita: **RMC** (aika, paikka, nopeus), **GGA** (fix quality, korkeus), **GSA** (DOP, satelliitit), **GSV** (näkyvyys). Talker ID voi olla GP, GL, GA, GN…

## Käytännössä

Älä luota NMEA-korkeuteen cm-tarkkuuteen — kenttien resoluutio on rajallinen. Survey-laitteissa käytä valmistajan binääriprotokollaa tai RTCM/RINEX-prosessointia.


[Lue lisää](https://gpsd.gitlab.io/gpsd/NMEA.html)
