# Miten suhteellisuusteoria vaikuttaa GPS-kelloihin käytännössä?

## Tilanne

Fysiikan kurssilla väitetään että GPS 'todistaa suhteellisuusteorian'. Mitä vastaanottimen tai satelliitin suunnittelija oikeasti korjaa?

## Ratkaisu

Satelliitin kello käy **nopeammin** heikommassa gravitaatiopotentiaalissa (yleinen suhteellisuusteoria) ja **hitaammin** liikkeen vuoksi (erityinen). Nettoefekti GPS:ssä on noin +38 μs/vrk ennen korjausta — ilman sitä virhe kertyisi kilometreihin. Kellot offsetataan tehtaalla ja jäljellä olevat termit mallinnetaan navigointiviestissä.

## Käytännössä

Käyttäjänä et säädä relativistisia parametreja itse — ne ovat osa ICD/ICD-GPS-spesifikaatiota. Tarkkuuspaikannuksessa (PPP) käytetään lisäksi tarkkoja kello- ja rata-arvioita (IGS).


[Lue lisää](https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps.html)
