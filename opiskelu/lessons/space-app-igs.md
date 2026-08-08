# Mikä on IGS:n rooli tarkkuus-GNSS:ssä?

## Tilanne

PPP-ohjelmisto hakee 'IGS final orbits'. Mitä saat?

## Ratkaisu

**IGS** (International GNSS Service) on globaali yhteistyö: verkko asemia + analyysikeskuksia. Tuotteita: tarkat radat (sp3), kellot, biasit, erds, antennikalibroinnit. Final/rapid/ultra-rapid eroavat viiveessä ja tarkkuudessa.

## Käytännössä

Reaaliaikainen PPP käyttää ultra-rapid/SSR-streamia; jälkikäsittely final-tuotteilla. Tarkista tuote epoch ja frame (ITRF).


[Lue lisää](https://igs.org/)
