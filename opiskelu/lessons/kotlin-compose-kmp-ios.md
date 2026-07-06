# Haluat saman Compose-UI:n Androidin ja iOS:n natiiviversioihin. Mikä polku?

## Tilanne

Koodisampo-projektissa Android-natiivi rakentuu Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee Ranger-käännöksestä, host hoitaa snapshotin ja syötteen — sama malli kuin webGameController.mjs.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kotlin Multiplatform + Compose Multiplatform — jaettu UI + erilliset platform-hostit

KMP on luonnollinen jatko Android-Compose-linjalle kun iOS tulee mukaan.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Käännä Jetpack Compose SwiftUI:ksi skriptillä; React Native iOS:lle, Compose Androidille — sama logiikka kopioituna. Compose Multiplatform jakaa UI-koodin; Ranger/host pitää silti bridgata per alusta.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://www.jetbrains.com/compose-multiplatform/)
