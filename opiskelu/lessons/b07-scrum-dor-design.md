# Sprint alkaa — arkkitehtuurisia avoimia kysymyksiä on vielä kolme. Pitäisikö tarina ollut sprintissä?

## Tilanne

Sprintin ensimmäinen daily: kehittäjät listaavat kolme avointa arkkitehtuurikysymystä — miten data partitionoidaan, mikä cache-strategia, miten migraatio tehdään ilman katkoa. Tarina otettiin sprinttiin viime planningissa, mutta teknisiä tuntemattomia ei selvitetty refinementissa.

Työ on käytännössä pysähdyksissä: jokainen kysymys vaatii päätöksen ennen koodausta. Sprint goal on vaarassa, koska arkkitehtuuripäätökset tehdään nyt kiireessä sprintin sisällä sen sijaan, että ne olisi tehty valmisteluvaiheessa.

Definition of Ready edellyttää riittävää ymmärrystä ennen sprinttiin ottoa.

## Ratkaisu

**Ei — DoR vaatii riittävän ymmärryksen ennen sprinttiin ottoa.**

Kolme avointa arkkitehtuurikysymystä tarkoittaa, että tarina ei täyttänyt DoR:ia. Tekniset tuntemattomuudet olisi pitänyt ratkaista refinementissa — spike-tarinalla tai arkkitehtuurisella keskustelulla — ennen sprint commitmentia.

Technical unknowns should be resolved in refinement — DoR.

## Käytännössä

Listaa DoR-checklistiin: "Ei avoimia arkkitehtuurikysymyksiä" tai "Spike tehty ja päätökset dokumentoitu". Jos sprint alkaa kysymyksillä, palauta tarina backlogiin ja käytä spike seuraavassa refinementissa — älä tee arkkitehtuuripäätöksiä dailyssä kiireessä.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices/blob/main/definition-of-ready.md)
