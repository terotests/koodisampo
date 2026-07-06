# Desktop-natiivi web-game:lle — miksi Tauri usein voittaa Electronin?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-game-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Pienempi binääri ja vähemmän muistia — järjestelmän WebView, Rust-backend tarvittaessa

Ohut kuori olemassa olevalle web-game/dist:lle — nopein desktop-polku.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Tauri vaatii aina internet-yhteyden; Electron on ainoa tapa ajaa Vite-buildia desktopilla. Electron toimii, mutta Tauri on kevyempi vaihtoehto staattiselle pelille.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://tauri.app/start/)
