# Miksi GNSS-satelliiteissa on atomikelloja?

## Tilanne

Kuulet väitteen että GPS on oikeastaan 'ajanmittausjärjestelmä'. Mitä se tarkoittaa satelliitin laitteistolle?

## Ratkaisu

Vastaanotin mittaa signaalin kulkuaikaa. Valon nopeudella **1 ns ≈ 30 cm**. Satelliitin kello synkronoidaan järjestelmän aikaan atomikelloilla (cesium, rubidium, Galileo: myös passiivinen vety-maser). Efemeridi sisältää kellokorjausparametrit, joilla vastaanotin kompensoi jäännösvirheitä.

## Käytännössä

Kun näet suuren clock bias -estimaatin vastaanottimessa, se on normaalia (vastaanottimen halpa oskillaattori). Satelliitin kellovirheet korjataan navigointiviestillä — ilman niitä ratkaisu harhautuisi kilometrejä.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Atomic_Clocks)
