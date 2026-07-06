# Godot + GDScript Koodisampo-logiikalle — mikä on piilokustannus?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Koodisampossa pelimoottori on jo Ranger — valinta koskee hostia, ei scene-puu-moottoria.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Koko Ranger + testit + CI pitää portata — kaksi totuutta ylläpidossa

Ilmainen moottori ≠ ilmainen migraatio.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: GDScript on identtinen Rangerin kanssa; Godot lukee .rgr-tiedostoja suoraan. Ylläpito-kustannus on duplikaattilogiikassa, ei lisenssissä.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.godotengine.org/en/stable/tutorials/scripting/)
