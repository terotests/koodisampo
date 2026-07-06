# Miksi Qt 6 on varteenotettava Koodisampo-tyyppiselle desktop-natiiville?

## Tilanne

Qt 6 on vahva valinta desktop-natiiviin: ikkuna, näppäimistö, offline ja isometrinen piirto ilman selainta. Androidissa projekti jatkaa Compose-linjaa.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Yksi C++/Qt-koodi Linux/Windows/macOS — näppäimistö, ikkuna, offline ilman selainta

Desktop-natiivi erillisellä UI-pinolla — rinnakkain web/Compose.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Qt on pakollinen kaikille peleille; Qt korvaa Ranger-logiikan automaattisesti. Qt on työkalu desktop-kuoreen, ei pelimoottorin korvike.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://doc.qt.io/qt-6/supported-platforms.html)
