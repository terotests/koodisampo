# Mitä tarkoittaa UTM/TM-projektion mittakaavakerroin 0,9996 keskimeridiaanilla?

## Tilanne

Mittaat 1000 m maastossa mutta TM-koordinaattien etäisyys on 999,6 m. Onko GPS rikki?

## Ratkaisu

Poikittaisessa Mercatorissa **mittakaavakerroin k0** (UTM: 0,9996) tarkoittaa, että keskimeridiaanilla tasomatka < ellipsoidimatka. Vyöhykkeen reunoilla mittakaava nousee yli 1:n. Ero on suunniteltu kompromissi, ei laitevika.

## Käytännössä

Pitkissä infra-linjoissa käytä grid-to-ground -korjauksia tai laske geodeettisia matkoja ellipsoidilla.


[Lue lisää](https://proj.org/en/stable/operations/projections/utm.html)
