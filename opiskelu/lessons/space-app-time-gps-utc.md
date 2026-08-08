# Mikä ero on GPS-ajan ja UTC:n välillä?

## Tilanne

Lokitiedoston aikaleima hyppää 18 sekuntia verrattuna GPS-viikkoon. Onko kello rikki?

## Ratkaisu

**GPS Time** alkoi 1980-01-06 ja ei lisää karkaussekunteja. **UTC** lisää. Ero on kokonaisia sekunteja (muuttuu leap secondilla). Vastaanotin muuntaa UTC:ksi navigointiviestin parametreilla. Galileo käyttää GST:tä, samankaltainen idea.

## Käytännössä

Järjestelmissä synkkaa NTP/PTP ja GNSS huolella. Dokumentoi käytätkö GPS-aikaa vai UTC:ta rajapinnoissa.


[Lue lisää](https://www.gps.gov/systems/gps/performance/accuracy/)
