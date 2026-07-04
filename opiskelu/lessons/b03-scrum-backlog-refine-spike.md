# Tarina vaatii teknistä selvitystä ennen estimointia — arkkitehtuuri epäselvä. Mitä teette?

## Tilanne

Refinementissa tiimi kohtaa tarinan "Siirrä tietojen synkronointi tapahtumapohjaiseksi malliksi". Product Owner tietää liiketoimintatarpeen, mutta kehittäjät eivät osaa arvioida työmäärää: pitäisikö käyttää message queuea, miten idempotenssi hoidetaan, mitkä palvelut muuttuvat?

Joku ehdottaa: "Arvioidaan vaikka 8 pistettä ja katsotaan sprintissä." Toiset vastustavat: "Emme tiedä edes mitä rakennamme." Estimointi jumittuu, eikä tarina etene backlogissa.

Empiirinen Scrum-prosessi hyväksyy, että kaikkea ei tiedetä etukäteen — mutta sitoutuminen sprinttiin vaatii riittävää ymmärrystä.

## Ratkaisu

**Spike / tutkimustarinoita refinementiin — aikarajattu oppiminen.**

Kun arkkitehtuuri tai tekninen ratkaisu on epäselvä, luodaan aikarajattu spike (tutkimustarina) refinementiin. Spike tuottaa tietoa — esimerkiksi proof-of-concept, arkkitehtuuripäätös tai selkeä arvio — ennen varsinaiseen toteutustarinoihin sitoutumista.

Empiirinen prosessi: spike tuottaa tietoa ennen sitoutumista.

## Käytännössä

Aikarajaa spike selkeästi (esim. 1–2 päivää) ja määrittele oppimistavoite: "Päätös message brokerista" tai "Arvio synkronointipolusta". Spike ei tuota shippattavaa tuotetta, mutta sen tulos syötetään varsinaisiin tarinoihin, jotka sitten täyttävät DoR:n.

[Lue lisää](https://scrumguides.org/scrum-guide.html#product-backlog)
