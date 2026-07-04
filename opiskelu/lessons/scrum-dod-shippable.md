# Mikä on Definition of Done -listan ydinvaatimus jokaiselle sprintin valmiille tarinalle?

## Tilanne

Sprintin viimeinen päivä. Kehittäjä sanoo tarinan olevan valmis, koska koodi on feature-branchilla ja QA on testannut stagingissa. Tuoteomistaja kysyy: voimmeko julkaista heti sprint reviewn jälkeen?

Samalla integraatiotiimi huomaa, että muutoksia ei ole vielä mergattu päähaaraan. Tuotantoon vietävä versio ja sprintin "valmis" tarina eivät ole sama asia — inkrementti ei ole yhtenäinen kokonaisuus.

## Ratkaisu

**Definition of Done (DoD)** varmistaa, että jokainen valmis tarina on oikeasti releasable increment. Ydinvaatimus: **inkrementti on tuotantokelpoinen ja integroitu ennen Done-merkintää**.

DoD ei tarkoita "omalla branchilla toimii" vaan "osana tuotteen nykyistä versiota voidaan turvallisesti viedä tuotantoon". Valmis tarina kasvattaa Product Backlogin arvoa — osittainen tai erillään oleva koodi ei.

## Käytännössä

- Kirjoita DoD:hen eksplisiittisesti: koodi mergattu päähaaraan / release-branchiin ennen Donea.
- CI buildaa ja testaa integroidun haaran — ei vain feature-branchin PR:ää.
- Sprint review esittelee inkrementtiä, joka täyttää DoD:n; muuten tarina jää backlogiin seuraavaan sprinttiin.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices)
