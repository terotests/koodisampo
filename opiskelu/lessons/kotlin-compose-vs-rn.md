# Miksi projekti voisi suosia Composea React Nativelle Android-natiivissa?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Pelilogiikka on Kotlinissa tai natiivissa coressa — RN toisi ylimääräisen JS-kerroksen ilman hyötyä

Suora natiivi host on yksinkertaisempi polku; RN sopii paremmin CRUD-sovelluksiin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Compose on aina nopeampi kuin React Native kaikissa sovelluksissa; React Native ei toimi Androidilla ollenkaan. Kyse on arkkitehtuurista: custom pelimoottori + RN = turha bridge.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/jetpack/compose)
