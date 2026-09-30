# Mikä on turvallisin tapa vapauttaa kontekstia pitkässä agenttisessiossa?

## Ratkaisu

Työkalutulokset ovat usein kontekstin suurin osa ja nopeimmin vanhenevaa. Kun malli on jo toiminut tuloksen perusteella, raakadataa harvoin tarvitaan uudelleen. Tyhjennys (tulos korvataan merkinnällä 'poistettu') on kevyin tiivistyksen muoto.

## Käytännössä

Säilytä viimeisimmät tulokset ennallaan. Malli käyttää usein juuri edellisen kierroksen dataa.


[Lue lisää](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
