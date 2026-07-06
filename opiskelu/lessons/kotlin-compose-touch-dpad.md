# Mobiilipelaaja liikkuu D-pad-napeilla. Miten välität suuntanäppäimen hostille?

## Tilanne

Koodisampo-projektissa Android-natiivi rakentuu Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee Ranger-käännöksestä, host hoitaa snapshotin ja syötteen — sama malli kuin webGameController.mjs.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Button onClick → gameController.handleKey("h") jne. — sama API kuin web/terminaali

Ohut host: UI lähettää merkkijononäppäimiä, Ranger tulkitsee ne.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Accelerometer liikuttaa hahmoa suoraan Rangerissa; Swipe-gesture muuttaa WorldMap-koordinaatteja UI:ssa. Sama handleKey-sopimus kaikilla alustoilla — ei erillisiä liike-API:ta.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/terotests/koodisampo/blob/main/docs/android-web-controller-parity.md)
