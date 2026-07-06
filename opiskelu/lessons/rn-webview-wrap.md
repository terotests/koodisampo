# RN-projekti haluaa silti mobiilijulkaisun olemassa olevasta web-pelistä. Käytännöllisin tapa?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** WebView tai Capacitor — aja valmis web-build, älä kirjoita RN-UI:ta pelille

Web-kuori on rehellisempi kuin RN-jäätyminen WebView-ratkaisuun silti.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Kirjoita koko kartta uudelleen FlatListillä; Porttaa koko pelilogiikka React-komponenteiksi. Capacitor/Tauri hoitaa saman ilman React Native -kerrosta.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/react-native-webview/react-native-webview)
