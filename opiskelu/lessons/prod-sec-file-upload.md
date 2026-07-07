# Profiilikuvan upload tarkistaa vain if filename.endswith('.jpg'). Mikä riski?

## Tilanne

Profiilikuvan upload tarkistaa vain tiedostonimen päätteen: `.jpg`.

## Ratkaisu

Tiedostopääte ei todista sisältöä.

- Tarkista MIME/sisältö magic bytes -tasolla
- Rajoita koko
- Uudelleenkoodaa kuva turvallisella kirjastolla
- Tallenna webrootin ulkopuolelle
- Generoi uusi tiedostonimi
- Älä suorita ladattua tiedostoa koskaan

**SVG** voi sisältää aktiivista sisältöä — kohdella eri tavalla kuin uudelleenkoodattua rasterikuvaa.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
