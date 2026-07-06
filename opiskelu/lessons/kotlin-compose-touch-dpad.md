# Mobiilipelaaja liikkuu D-pad-napeilla. Miten välität suuntanäppäimen hostille?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Button onClick → gameController.handleKey("h") jne. — sama API kuin web/terminaali

Ohut host: UI lähettää merkkijononäppäimiä, simulaatiokirjasto tulkitsee ne.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Accelerometer liikuttaa hahmoa suoraan simulaatiokirjastossa; Swipe-gesture muuttaa WorldMap-koordinaatteja UI:ssa. Sama handleKey-sopimus kaikilla alustoilla — ei erillisiä liike-API:ta.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/develop/ui/compose/touch-input)
