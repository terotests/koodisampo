# Tarina: 'Paranna suorituskykyä'. Refinementissa puuttuu hyväksymiskriteerit. DoR-korjaus?

## Tilanne

Backlogissa on tarina "Paranna suorituskykyä". Product Owner tietää, että käyttäjät valittavat hitaudesta, mutta tarina ei kerro mitä mitataan, missä järjestelmässä tai mikä on riittävä parannus. Refinementissa kehittäjä kysyy: "Parannetaanko API:a, tietokantaa vai frontendiä? Mikä on tavoite?"

Ilman mitattavia kriteereitä tarina ei ole testattavissa — kukaan ei voi sanoa sprintin lopussa, onko työ valmis. "Nopeampi" on subjektiivista; tiimi arvailee ja tekee turhaa työtä väärään kohtaan.

Definition of Ready vaatii, että tarina on testattavissa ennen sprinttiin ottoa.

## Ratkaisu

**Määrittele mitattavat kriteerit (esim. p95 < 200 ms) ennen sprinttiin ottoa.**

Hyväksymiskriteerit on kirjoitettava mitattavasti: esimerkiksi "API-endpointin p95-vasteaika alle 200 ms kuormitustestissä X" tai "Sivun LCP alle 2,5 s mobiilissa". Näin tiimi tietää, mitä optimoida ja milloin työ on Done.

Definition of Ready: tarina on testattavissa ja arvioitavissa.

## Käytännössä

Mittaa nykytila ennen sprinttiä — baseline tekee kriteereistä konkreettisia ("nyt 800 ms, tavoite 200 ms"). PO:n ei tarvitse olla tekninen asiantuntija, mutta tiimi auttaa muotoilemaan kriteerit yhdessä refinementissa. Vältä yleisiä adjektiiveja: nopea, parempi, sujuvampi.

[Lue lisää](https://scrumguides.org/scrum-guide.html#product-backlog)
