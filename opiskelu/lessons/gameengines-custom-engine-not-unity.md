# Miksi Unity/Godot ei ole ensisijainen valinta olemassa olevalle custom-simulaatiopelille?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Pelilogiikka on jo omassa simulaatiokirjastossa — uudelleenkirjoitus moottoriin on turhaa

Moottori on jo olemassa ja testattu; tarvitaan host, ei automaattisesti Unityä.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Unity ei tue 2D-karttoja; Godot kieltää JSON-sisällön. Ongelma on investoidun logiikan uudelleenkäyttö, ei 2D-rajoite.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.unity3d.com/Manual/ExecutionOrder.html)
