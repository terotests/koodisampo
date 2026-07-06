# Haluat saman Compose-UI:n Androidin ja iOS:n natiiviversioihin. Mikä polku?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kotlin Multiplatform + Compose Multiplatform — jaettu UI + erilliset platform-hostit

KMP on luonnollinen jatko Android-Compose-linjalle kun iOS tulee mukaan.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Käännä Jetpack Compose SwiftUI:ksi skriptillä; React Native iOS:lle, Compose Androidille — sama logiikka kopioituna. Compose Multiplatform jakaa UI-koodin; core/host pitää silti bridgata per alusta.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://www.jetbrains.com/compose-multiplatform/)
