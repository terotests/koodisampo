# Simulaatiodispatch kestää alle millisekunnin. Mistä päivität UI:n dispatchin jälkeen?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Main dispatcher / UI-thread — snapshot StateFlow:hun, Compose recompose

GameSession voi ajaa taustalla, mutta state-päivitys ja Compose ovat main-threadillä.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Dispatchers.IO — kaikki Composable-kutsut taustalla; GlobalScope.launch ilman thread-vaihtoa. Compose ei ole thread-safe — UI-päivitykset aina pääsäikeeseen.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/kotlin/coroutines)
