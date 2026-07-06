# Peli on pääosin dialogeja, quizeja ja teksti-UI:ta. Mikä renderöintitarve?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Koodisampossa pelimoottori on jo Ranger — valinta koskee hostia, ei scene-puu-moottoria.

Olet suunnittelemassa Koodisampo-tyyppisen vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää Ranger-lähdekoodissa (`lib/game/ranger/`), hostit (`hosts/`, `web-game/`, Android) ovat ohuita: ne kutsuvat `handleKey`-tyyppistä API:a ja renderöivät snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kevyt 2D/teksti riittää — DOM, Compose tai Qt Widgets, ei 3D-pipelinea

UI-kerros hoitaa tekstin; moottorin 3D-ominaisuudet ovat ylikilloa.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Pakollinen Unreal Motion Matching NPC:ille; Unity HDRP varjojen vuoksi. Teksti- ja valikkopohjainen peli on web/natiivi-UI:n vahvuusalue.

## Käytännössä

Pidä mielessä projektin jaettu snapshot-skeema (`docs/android-web-controller-parity.md`): kartta, encounter, story, hissi ja overlay tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä (`npm run test:engine`) ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://github.com/terotests/koodisampo/blob/main/README.md)
