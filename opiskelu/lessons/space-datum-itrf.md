# Mikä on ITRF geodesiassa?

## Tilanne

IGS-tuote on 'ITRF2020'-kehyksessä. Miten se liittyy WGS84-puhelimen paikkaan?

## Ratkaisu

**ITRF** on tieteellinen, jatkuvasti ylläpidetty globaali referenssikehys (asemat + nopeudet). WGS84-realisaatiot on pidetty hyvin lähellä ITRF:ää. Tarkkuus-PPP:ssä ilmoita aina frame + epoch. ETRS89 on ITRF:stä johdettu Euroopan kiinnitys.

## Käytännössä

Kun yhdistät vanhaa ja uutta mittausta, tarkista epoch. Laattaliike ~cm/v tekee eron vuosikymmenessä.


[Lue lisää](https://itrf.ign.fr/)
