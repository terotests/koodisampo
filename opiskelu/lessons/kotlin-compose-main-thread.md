# Ranger-dispatch kestää alle millisekunnin. Mistä päivität UI:n dispatchin jälkeen?

## Tilanne

Koodisampo-projektissa Android-natiivi rakentuu Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee Ranger-käännöksestä, host hoitaa snapshotin ja syötteen — sama malli kuin webGameController.mjs.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Main dispatcher / UI-thread — snapshot StateFlow:hun, Compose recompose

GameSession voi ajaa taustalla, mutta state-päivitys ja Compose ovat main-threadillä.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Dispatchers.IO — kaikki Composable-kutsut taustalla; GlobalScope.launch ilman thread-vaihtoa. Compose ei ole thread-safe — UI-päivitykset aina pääsäikeeseen.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/kotlin/coroutines)
