# Vuoropohjaisessa pelissä pelilogiikka on jaetussa simulaatiokirjastossa ja host rakentaa snapshotin UI:lle. Mikä on Compose-hostin rooli?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Ohut kerros: input → simulaatiokirjasto, snapshot → Composable-näkymät

Sama malli eri hosteissa: logiikka erillisessä coressa, UI vain renderöi snapshotin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Compose hoitaa NPC-tunteet ja kerroslukot suoraan StateFlow:ssa; Simulaatiokirjasto ajetaan Composable-funktion sisällä ilman erillistä kontrolleria. Host ei saa sisältää pelisääntöjä — se välittää syötteen ja rakentaa näytettävän tilan.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/topic/architecture)
