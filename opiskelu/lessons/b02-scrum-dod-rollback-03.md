# Tuotantoon mennyt feature ei täytä DoD:ia — miten tiimi reagoi sprintin jälkeen?

## Tilanne

Hätäjulkaisu: tuoteomistaja painosti viemään featuren tuotantoon ennen sprint reviewta. Deploy meni läpi, mutta DoD puuttuu: integraatiotestit ajamatta, dokumentaatio puutteellinen, security-skannaus ohitettu.

Sprintin jälkeen tiimi pohtii, miten käsitellä tilanne. Joku ehdottaa "merkitään Done nyt, kun se on jo tuotannossa" — toinen muistuttaa, että DoD on laadun lattia, ei muistilappu.

## Ratkaisu

**Palautetaan backlogiin — tekninen velka korjataan, DoD on minimi laatu.** DoD on laadun lattia — poikkeukset dokumentoidaan ja korjataan.

Tuotantoon päässyt feature ei muutu automaattisesti Doneksi. Tiimi luo backlog-tarinoita puuttuville DoD-kohdille, priorisoi korjaukset ja dokumentoi poikkeuksen. Seuraavassa sprintissä inkrementti täytetään DoD:n mukaiseksi.

## Käytännössä

- Kirjaa poikkeus retrospektiiviin: miksi DoD ohitettiin ja miten estetään toisto.
- Älä normalisoi "Done ilman DoD:ta" — se heikentää koko listan merkitystä.
- Harkitse feature flagia tai rollbackia, jos tuotannossa oleva versio ei täytä minimilaatua turvallisesti.

[Lue lisää](https://scrumguides.org/scrum-guide.html#definition-of-done)
