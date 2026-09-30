# Node.js osaa nykyään ajaa .ts-tiedostoja suoraan. Mitä se käytännössä tekee?

## Ratkaisu

Node 22.6 toi kokeellisen `--experimental-strip-types`-lipun, ja myöhemmin ominaisuus otettiin oletuksena käyttöön. Tuettuna on vain 'erasable' syntaksi: tyypit voi poistaa muuttamatta muuta koodia. Esim. `enum` ja `namespace` vaativat muunnoksen, eivätkä ne toimi pelkällä strippauksella.

## Käytännössä

Laita tsconfigiin `erasableSyntaxOnly` (TS 5.8+), niin kääntäjä varoittaa syntaksista, jota Node ei osaa ajaa.


[Lue lisää](https://nodejs.org/api/typescript.html)
