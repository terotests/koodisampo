# Tiimi saa kymmeniä hälytyksiä päivässä eikä tiedä mikä on tärkeää. Mikä on ongelma?

## Tilanne

Alertteja tulee CPU:sta, muistista, yksittäisistä 500-virheistä ja satunnaisista healthcheck-flapeista. Oikeat käyttäjäongelmat hukkuvat meluun. On-call väsyy ja alkaa ignoorata hälytyksiä — myös niitä, jotka olisivat kriittisiä.

**Alert fatigue** tarkoittaa, että liian monet hälytykset eivät johda toimenpiteeseen. Tiimi ei enää tiedä, mikä on oikeasti rikki.

## Ratkaisu

**Alertit eivät kuvaa käyttäjävaikutusta — hälytä vain asioista jotka vaativat toimenpiteen.**

Alertin pitää kuvata käyttäjävaikutusta tai selkeää toiminnan tarvetta.

Hyvä alert:

- kertoo mitä on rikki
- liittyy käyttäjävaikutukseen tai SLO:hon
- vaatii ihmisen toimenpiteen
- sisältää linkin dashboardiin/runbookiin

Huono alert:

- laukeaa usein ilman vaikutusta
- ei kerro mitä tehdä
- mittaa vain yksittäistä koneen metriikkaa ilman kontekstia

Aloita muutamasta tärkeästä: error rate liian korkea, p95/p99 latency liian korkea, onnistuneiden tilausten/maksujen määrä putoaa, job queue kasvaa, dead-letter queue kasvaa.

## Käytännössä

Poista tai nosta kynnysarvoja hälytyksille, jotka eivät vaadi toimenpidettä. Yhdistä useita pieniä alertteja yhdeksi käyttäjävaikutukseen perustuvaksi. Jokaiselle alertille kirjoita lyhyt runbook: mitä tarkistaa ensin. Tämä täydentää `healthy-but-down` -kohtaa: ensin mitataan oikeat signaalit, sitten hälytetään niistä.

[Lue lisää](https://sre.google/workbook/alerting-on-slos/)
