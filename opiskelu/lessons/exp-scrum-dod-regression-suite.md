# Tuotantoon meni bugi joka olisi kaatunut regressiotestissä. Mitä DoD:iin lisätte?

## Tilanne

Yöllä hälytys: maksun vahvistus epäonnistuu tuotannossa. Juurisyy on regressio — edellisessä sprintissä muutettu validointilogiikka rikkoi vanhan polun. Kehittäjä sanoo: "Uusi feature toimi QA:ssa; emme ajaneet koko regressiopakettia ennen deployta."

Post mortemissa tiimi toteaa, että regressiotestit ovat olemassa CI:ssä, mutta DoD ei vaadi niiden läpäisyä ennen Done-merkintää. Sprintin lopussa ajettiin vain uuden featuren testit.

## Ratkaisu

DoD määrittää shippable incrementin — testit ovat osa valmiutta. Lisää DoD:hen: **automaattiset regressiotestit vihreänä ennen Done-merkintää**.

Kun regressio olisi kaatunut CI:ssä, bugi ei olisi päässyt tuotantoon. DoD sitoo sprintin lopun laatuporttiin, joka kattaa koko järjestelmän, ei vain uuden koodin.

## Käytännössä

- Määrittele CI-putkessa required check: koko regressiosuite (tai smoke + kriittinen polku) ennen mergeä.
- Erottele nopeat PR-checkit ja täysi regressio — mutta DoD vaatii täyden ennen Donea.
- Kun regressio löytyy tuotannosta, päivitä DoD ja lisää puuttuva testi samaan sprinttiin.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices)
