# API palauttaa 429- tai 529-virheen (rate limit / ylikuorma). Mikä on oikea toimintatapa?

## Ratkaisu

429 = oma nopeusraja täynnä, 529 = palvelu ylikuormittunut. Molemmat ovat ohimeneviä. Odota kasvavin välein (esim. 1 s, 2 s, 4 s + satunnainen jitter) ja lue `retry-after`, jos se on annettu.

## Käytännössä

Viralliset SDK:t tekevät tämän valmiiksi. Omassa HTTP-toteutuksessa muista rajata yritysten määrä ja näyttää käyttäjälle, että odotetaan.


[Lue lisää](https://docs.claude.com/en/api/errors)
