# Mitä geoidiundulaatio N tarkoittaa?

## Tilanne

GPS-korkeus ja vaaituskorkeus eroavat ~18 m. Onko vastaanotin rikki?

## Ratkaisu

Ero on usein **geoidiundulaatio N**. Ellipsoidi korkeus h ja ortometrinen H liittyvät: **H ≈ h − N**. Jos unohdat N:n, 'virhe' on kymmeniä metrejä vaikka GNSS toimisi täydellisesti.

## Käytännössä

Käytä alueellista geoidimallia (Suomi: FIN-geoidit) kun muutat GNSS-korkeuksia N2000:een. Globaali EGM2008 on kompromissi mutta ei korvaa kansallista mallia tarkkuustyössä.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Geoid)
