# Milloin Unity/Godot OLISI järkevä aloittaa tyhjästä?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Uusi real-time action/3D-peli ilman olemassa olevaa simulaatiokoodia

Pelimoottorit loistavat uusissa visuaalisissa peleissä — ei legacy-simulaatiossa.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Aina kun projektissa on JSON-tiedostoja; Kun tarvitaan quiz-kysymyksiä. Jos simulaatio on jo olemassa, moottorin vaihto voi maksaa enemmän kuin hyöty.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.unity3d.com/Manual/index.html)
