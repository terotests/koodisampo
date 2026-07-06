# Miksi Unity/Godot ei ole ensisijainen valinta Koodisampo-tyyppiselle pelille?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Koodisampossa pelimoottori on jo Ranger — valinta koskee hostia, ei scene-puu-moottoria.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** ~5700 riviä pelilogiikkaa on jo Rangerissa — uudelleenkirjoitus moottoriin on turhaa

Moottori on jo olemassa (.rgr + testit); tarvitaan host, ei Unity.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Unity ei tue 2D-karttoja; Godot kieltää JSON-sisällön. Ongelma on investoidun logiikan uudelleenkäyttö, ei 2D-rajoite.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/terotests/koodisampo/tree/main/lib/game/ranger)
