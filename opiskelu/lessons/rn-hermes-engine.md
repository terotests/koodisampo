# Hermes on RN:n oletus-JS-moottori. Relevanssi jos pelilogiikka on silti natiivissa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Vähäinen — JS hoitaa vain ohuen UI-kuoren, ei simulaatiota

JS-moottorin valinta merkitsee vain jos logiikka on JS:ssä.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Hermes ajaa natiivimoottorin nopeammin kuin V8; Ilman Hermesiä natiivimoduulit eivät toimi. Kun pelilogiikka on natiivissa, Hermes on sivuseikka.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/docs/hermes)
