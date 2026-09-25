# RTK-ratkaisu putoaa hetkeksi float-tilaan, kun auto ajaa sillan ali. Mitä kantoaaltomittaukselle tapahtui?

## Tilanne

Traktorin RTK-ohjaus toimii pellolla senttien tarkkuudella (fixed). Kun kone ajaa sillan tai puurivin ali, ratkaisu putoaa hetkeksi float-tilaan ja paikka heittää desimetrejä, kunnes fixed palaa muutaman sekunnin päästä.

## Ratkaisu

Kyse on **cycle slipistä**. Kantoaaltovaiheen mittaus perustuu siihen, että vastaanotin seuraa vaihetta jatkuvasti ja laskee kokonaisia aallonpituuksia. Kun signaali katkeaa hetkeksi, laskurin jatkuvuus menetetään, eikä vastaanotin tiedä, montako kokonaista aaltoa katkon aikana kului. Kokonaislukuepäselvyys (ambiguity) pitää ratkaista uudelleen, ja sillä välin ratkaisu on float.

Vastaanotin havaitsee slipit esim. vertaamalla vaihetta koodimittaukseen tai eri taajuuksien yhdistelmiin (geometry-free, Melbourne–Wübbena) ja Doppleriin.

## Käytännössä

- Mitä useampi satelliitti ja taajuus on seurannassa, sitä nopeammin ambiguity ratkeaa uudelleen.
- Inertia-anturin (IMU) yhdistäminen GNSS:ään siltaa lyhyet katkot.
- Jälkikäsittelyssä slipit merkitään RINEX-tiedostoon (loss of lock -indikaattori).

[Lue lisää](https://gssc.esa.int/navipedia/index.php/Detector_based_in_carrier_phase_data:_The_single-frequency_case)
