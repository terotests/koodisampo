# Tiimi viimeistelee koodin mutta increment jää testaamatta ja dokumentoimatta. Täyttääkö se DoD:ia?

## Tilanne

Sprintin reviewissa tiimi esittelee "valmiin" featuren — koodi on mergattu, demo toimii kehittäjän koneella. Testaus on "melkein valmis", API-dokumentaatio puuttuu, tuotantodeployausta ei ole tehty. PO kysyy: "Onko tämä inkrementti?"

Tiimi vastaa: "Koodi on valmis — loput hoidetaan seuraavassa sprintissä."

## Ratkaisu

**Ei** — inkrementti ei täytä **Definition of Done** -kriteerejä.

- Cross-functional tiimi toimittaa **valmiin** inkrementin — DoD:n mukaisesti jokaisen sprintin lopussa.
- "Koodi valmis" ≠ "increment valmis": testaus, dokumentaatio, deploy-valmius kuuluvat usein DoD:hen.
- Sprintin tavoite on **käyttökelpoinen** lisäys tuotteeseen — ei keskeneräinen pino.

Scrum Guide: Increment on DoD:n mukaisesti valmis — läpinäkyvästi kaikille sidosryhmille.

## Käytännössä

Päivitä DoD yhdessä tiimin kanssa ja noudata sitä reviewissa: jos DoD puuttuu, tarina ei ole Done — burndown odottaa. Älä siirrä testausta "automaattisesti seuraavaan sprinttiin" ilman PO:n uudelleenpriorisointia. Cross-functionality tarkoittaa koko polkua valmiiksi, ei vain commitia.

[Lue lisää](https://scrumguides.org/scrum-guide.html#increment)
