# Mitä Keplerin rataelementit kuvaavat satelliitin yhteydessä?

## Tilanne

Almanakissa tai TLE-tiedostossa näkyy lukuja kuten inklinaatio ja eksentrisyys. Haluat tietää, mitä ne käytännössä tarkoittavat GNSS-satelliitille.

## Ratkaisu

**Keplerin rataelementit** kuvaavat ellipsiradan muotoa (puolisuuriakseli *a*, eksentrisyys *e*), tasoa (inklinaatio *i*, nousevan solmun pituus Ω), periapsiksen argumenttia ω ja satelliitin paikkaa radalla (todellinen/mean anomaly). GNSS-efemeridit käyttävät näitä (tai ekvivalentteja) laskemaan satelliitin ECEF-koordinaatit tietyllä ajanhetkellä.

## Käytännössä

Vastaanotin ei näytä Kepler-lukuja käyttäjälle — se muuntaa efemeridin XYZ-sijainniksi. Kun debugaat huonoa ratkaisua, tarkista että efemeridi/almanakka on tuore: vanhentunut rata → väärä satelliittipaikka → metrien virheet.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Keplerian_Elements)
