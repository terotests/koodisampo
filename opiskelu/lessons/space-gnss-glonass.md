# Mikä erottaa klassisen GLONASS-signaalin GPS:stä taajuuksien jaon suhteen?

## Tilanne

RF-suunnittelija kysyy, miksi GLONASS-kanavat olivat eri taajuuksilla. Mikä oli periaate?

## Ratkaisu

Klassinen **GLONASS** erotteli satelliitit **FDMA**:lla (Frequency Division Multiple Access): kullakin satelliitilla oma taajuuskanava. **GPS** erottelee satelliitit **CDMA**:lla (eri PRN-koodit samalla taajuudella). Nykyaikainen GLONASS CDMA -signaalit lähentyvät GPS/Galileo-mallia.

## Käytännössä

Monikonstellaatiovastaanottimissa GLONASS-kanavat tarvitsevat hieman erilaisen RF-ketjun. Tarkista moduulin speksi ennen integraatiota.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/GLONASS_Signal_Structure)
