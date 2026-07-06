# Koodisampo-tyyppisessä pelissä pelilogiikka on Rangerissa ja host rakentaa snapshotin UI:lle. Mikä on Compose-hostin rooli?

## Tilanne

Koodisampo-projektissa Android-natiivi rakentuu Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee Ranger-käännöksestä, host hoitaa snapshotin ja syötteen — sama malli kuin webGameController.mjs.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Ohut kerros: handleKey → Ranger, snapshot → Composable-näkymät

Sama malli kuin webGameController: logiikka Rangerissa, UI vain renderöi snapshotin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Compose hoitaa NPC-tunteet ja kerroslukot suoraan StateFlow:ssa; Ranger ajetaan Composable-funktion sisällä ilman erillistä kontrolleria. Host ei saa sisältää pelisääntöjä — se välittää syötteen ja rakentaa näytettävän tilan.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/topic/architecture)
