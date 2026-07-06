# Web tallentaa karmaa localStorageen. Android-pariteetti tallennukselle?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** DataStore (Preferences tai Proto) — sama JSON-skeema kuin web/terminaali

Jaettu tallennusskeema hostissa — DataStore on moderni korvike SharedPreferencesille.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Vain muistissa — tallennus ei kuulu mobiiliin; SQLite-taulu jokaiselle NPC-suhteelle erikseen ilman skeemaa. Persistenssi on host-vastuu; Android-gap dokumentissa yksi suurimmista puutteista.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/topic/libraries/architecture/datastore)
