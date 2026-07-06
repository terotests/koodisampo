# Pelin UI-tila (valitsimen collapse, aktiivinen overlay) elää hostissa eikä simulaatiokirjastossa. Minne se kannattaa laittaa Androidissa?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** ViewModel + StateFlow / mutableStateOf — selkeä elinkaari ja rotaatio

UI-only tila (kuten elevatorPickerCollapsed) kuuluu ViewModeliin, ei pelimoottoriin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Singleton Application-luokassa ilman scopetusta; GameSession-kenttään pysyvästi. ViewModel erottaa näkymätilan pelilogiikasta ja selviää konfiguraatiomuutoksista.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/topic/libraries/architecture/viewmodel)
