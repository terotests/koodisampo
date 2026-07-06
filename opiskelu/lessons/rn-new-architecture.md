# React Native New Architecture (Fabric/TurboModules) — hyöty peli-hostille?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Nopeampi JS↔native — ei poista tarvetta välttää RN:ää custom-moottorissa

Parannus bridgeen, ei ratkaisua arkkitehtuurivalintaan.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: New Arch korvaa tarpeen natiivi-UI:lle kokonaan; Fabric renderöi automaattisesti isometrisen kartan. New Arch on hyvä RN-sovelluksille, ei tee RN:stä pelimoottoria.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/architecture/landing-page)
