# Tiimi debateaa DoD:stä. Mikä kuuluu tyypillisesti moderniin Definition of Done -listaan?

## Tilanne

Retrospektiivissa tiimi päivittää DoD-listaa. Joku ehdottaa: "Merkitään Done kun koodi on reviewattu — testit ajetaan myöhemmin." QA vastaa, että viime sprintin regressio löytyi vasta tuotannosta, koska manuaalinen testaus jäi kiireessä.

Ilman yhteistä linjaa kehittäjät ja testaajat tulkitsevat "valmista" eri tavoin. Burndown näyttää vihreältä, mutta CI on punainen tai testejä ei ole ajettu ollenkaan.

## Ratkaisu

Moderni DoD sisältää usein automaation — regressio ei jää sprintin jälkeen. Tyypillinen kohta: **automaattiset testit ajettu ja läpäisty CI:ssä ennen Donea**.

DoD sitoo laadun sprintin loppuun: unit-, integratio- ja tarvittavat end-to-end-testit ovat osa valmiuskriteeriä, ei erillinen "testausvaihe" sprintin jälkeen.

## Käytännössä

- Määrittele DoD:ssa testitasot (unit, integraatio, smoke) ja CI-putken vaatimukset.
- Estä Done-merkintä, jos CI on punainen — käytä branch protectionia ja required checks -asetuksia.
- Päivitä DoD retrospektiivissä, kun testikattavuus tai putki kehittyy; koko tiimi omistaa listan.

[Lue lisää](https://scrumguides.org/scrum-guide.html)
