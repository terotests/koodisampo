# Uusi API hidastaa raporttia 10× — tarina 'done' ilman suorituskykytestiä. Miten DoD auttaa?

## Tilanne

Sprintin lopussa uusi raportti-API on valmis: funktionaalisuus toimii, testit vihreät. Tuoteomistaja hyväksyy tarinan Done-tilaan. Viikkoa myöhemmin asiakaspalvelu valittaa: kuukausiraportin generointi kestää kymmenen minuuttia aiemman minuutin sijaan.

Juurisyy: N+1-kyselyt ja puuttuva indeksi. Kukaan ei mitannut suorituskykyä ennen Done-merkintää — DoD:ssä oli vain funktionaaliset kriteerit.

## Ratkaisu

DoD on laajennettavissa laatuattribuutteihin — tiimin sopimus. **DoD voi sisältää NFR-kriteerit (esim. p95 < 200 ms) ennen hyväksyntää.**

Funktionaalinen valmius ei riitä, jos tuote on käyttökelvoton hidastumisen takia. Suorituskyky, saatavuus ja skaalautuvuus voidaan kirjata DoD:hen samalla tavoin kuin testit ja dokumentaatio.

## Käytännössä

- Määrittele kriittisille poluille mitattavat tavoitteet (latency, throughput) ja lisää ne DoD:hen.
- Aja suorituskykytestit CI:ssä tai stagingissa ennen Donea — esim. baseline-vertailu edelliseen versioon.
- Jos NFR rikkoutuu, tarina ei ole Done; korjaus tai erillinen perf-tarino backlogiin seuraavaan sprinttiin.

[Lue lisää](https://scrumguides.org/scrum-guide.html#definition-of-done)
