# PPP-ratkaisu tarvitsee käynnistyksen jälkeen kymmeniä minuutteja ennen senttitasoa, RTK vain muutamia sekunteja. Miksi?

## Tilanne

Valitset senttitason paikannusta mittalaitteeseen. RTK-ratkaisu on fixed muutamassa sekunnissa, kun lähellä on tukiasema. PPP-palvelu toimii ilman tukiasemaa missä tahansa, mutta tarkkuus paranee senttitasolle vasta 15–30 minuutissa.

## Ratkaisu

**RTK** laskee eron lähellä olevaan tukiasemaan. Ionosfääri- ja troposfääriviiveet sekä rata- ja kellovirheet ovat lähes samat molemmilla vastaanottimilla, joten ne kumoutuvat, ja ambiguity ratkeaa nopeasti.

**PPP** käyttää yhtä vastaanotinta ja korjauspalvelun tarkkoja ratoja ja kelloja. Ilmakehäviiveet ja kantoaallon ambiguityt se joutuu **estimoimaan itse** havainnoista. Estimaatit tarkentuvat vasta, kun satelliittigeometria muuttuu riittävästi, ja tätä vaihetta kutsutaan konvergenssiksi.

## Käytännössä

- PPP-RTK-palvelut (esim. Galileo HAS, kaupalliset palvelut) lähettävät myös alueellisia ilmakehäkorjauksia ja lyhentävät konvergenssia minuutteihin.
- Monitaajuus- ja monijärjestelmävastaanotin nopeuttaa konvergenssia.
- Staattinen mittaus, jossa aikaa on, sopii PPP:lle hyvin. Liikkuvassa käytössä ilman tukiasemaverkkoa PPP on usein ainoa vaihtoehto.

[Lue lisää](https://gssc.esa.int/navipedia/index.php/Precise_Point_Positioning)
