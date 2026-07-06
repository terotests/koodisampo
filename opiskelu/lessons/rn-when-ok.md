# Milloin React Native olisi silti perusteltu peliprojektissa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kun koko tuote on jo RN-sovellus ja peli on pieni osa (esim. quiz-näkymä)

RN sopii upotettuun quiz-/lomakenäkymään olemassaosaan RN-appiin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Aina kun tarvitaan isometrinen kartta; Kun pelilogiikka on suuri erillinen custom-core. Jos tuote on pääosin peli, RN ei välttämättä ole sen ydin.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/docs/getting-started)
