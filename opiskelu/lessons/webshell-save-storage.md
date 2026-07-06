# Web käyttää IndexedDB:tä. Capacitor/Tauri-tallennus vastine?

## Tilanne

Tauri ja Capacitor paketoivat olemassa olevan web-game-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Capacitor Preferences / Filesystem tai Tauri fs plugin — sama JSON-skeema

Host hoitaa persistenssin — plugin API korvaa IndexedDB:n tarvittaessa.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Tallennus ei toimi kuoressa — vain selain; localStorage toimii aina ilman rajoituksia mobiilissa. WebView IndexedDB voi toimia, mutta natiivi plugin on luotettavampi.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://capacitorjs.com/docs/apis/preferences)
