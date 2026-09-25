# Tiimin DoD vaatii päivitetyn API-dokumentaation. Feature on testattu, mutta dokumentaatio puuttuu, ja tiimi haluaa merkitä sen valmiiksi. Mitä teette?

## Tilanne

Sprintin lopussa tarina on koodattu ja unit-testit vihreät. Tiimin DoD:ssa on kohta "API-dokumentaatio päivitetty", mutta dokumentaatio (OpenAPI, käyttöohje, changelog) puuttuu. Tuoteomistaja painostaa merkitsemään tarinan Done, jotta burndown näyttää hyvältä.

Ilman dokumentaatiota seuraava tiimi, integraatiokumppani tai tuki ei tiedä miten rajapintaa käytetään — "valmis" tarkoittaa vain kehittäjän mielessä valmista.

## Ratkaisu

**Definition of Done (DoD)** on tiimin yhteinen laatulista. Jos dokumentaatio on DoD:ssa, tarina **ei ole Done** ilman sitä — riippumatta testien tilasta.

Tyypillinen DoD:

- Koodi reviewattu ja mergattu
- CI vihreä
- Testit (unit + tarvittava integraatio)
- **Dokumentaatio päivitetty**
- Deploy-valmis / tuotantoon vietävissä

DoD on sopimus koko tiimin kanssa — ei yksittäisen kehittäjän päätös.

## DoD vs DoR

- **DoR (Ready):** valmis *aloittamaan* sprintissä. DoR ei ole Scrum Guiden käsite, vaan monien tiimien lisäkäytäntö.
- **DoD (Done):** valmis *julkaistavaksi* sprintin jälkeen.

Dokumentaatio kuuluu yleensä DoD:hen, ei DoR:ään.

[Lue lisää](https://scrumguides.org/scrum-guide.html#definition-of-done)
