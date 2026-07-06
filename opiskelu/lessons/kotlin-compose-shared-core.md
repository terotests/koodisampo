# Miten Android-host saa saman pelilogiikan kuin web-versio ilman JS-kopiota?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Jaettu core käännetään tai paketoidaan Kotlin-kirjastoksi samaa lähdettä käyttäen

Sama lähde ja sama testattu logiikka — yksi totuus kaikilla alustoilla.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Käännä web-bundlen JavaScript Kotliniksi käsin jokaisessa releasessa; Upota Node.js WebViewiin ja aja JS suoraan. Duplikaattilogiikka on ylläpidon painajainen, vaikka se näyttäisi aluksi nopealta.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/kotlin)
