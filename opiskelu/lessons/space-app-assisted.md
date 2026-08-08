# Mitkä A-GNSS (assisted GNSS) tyypillisesti tuo vastaanottimelle?

## Tilanne

Puhelin saa fixin sekunneissa sisätilojen reunalla, erillismoduuli minuuteissa. Miksi?

## Ratkaisu

**A-GNSS** lataa operaattorin/Googlen kautta ajan, likimääräisen paikan ja efemeridit. Vastaanotin tietää mitä PRN:iä etsiä ja millä Dopplerilla → **TTFF** romahtaa. Ilman apua cold start odottaa navigointiviestin latausta satelliitista (~12,5+ s per frame, usein pidempään).

## Käytännössä

IoT-moduulissa ilman verkkopua budjetoi pidempi TTFF tai tallenna efemeridi/almanakka flashiin.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Assisted_GNSS)
