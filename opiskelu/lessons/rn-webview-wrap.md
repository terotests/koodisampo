# RN-projekti haluaa silti mobiilijulkaisun olemassa olevasta web-gamesta. Käytännöllisin tapa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo Rangerissa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** WebView tai Capacitor — aja valmis web-build, älä kirjoita RN-UI:ta pelille

Web-kuori on rehellisempi kuin RN-jäätyminen WebView-ratkaisuun silti.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Kirjoita koko kartta uudelleen FlatListillä; Porttaa 5700 riviä Ranger-logiikkaa React-komponenteiksi. Capacitor/Tauri hoitaa saman ilman React Native -kerrosta.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/react-native-webview/react-native-webview)
