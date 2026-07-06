# Peli on pääosin dialogeja, quizeja ja teksti-UI:ta. Mikä renderöintitarve?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Kevyt 2D/teksti riittää — DOM, Compose tai Qt Widgets, ei 3D-pipelinea

UI-kerros hoitaa tekstin; moottorin 3D-ominaisuudet ovat ylikilloa.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Pakollinen Unreal Motion Matching NPC:ille; Unity HDRP varjojen vuoksi. Teksti- ja valikkopohjainen peli on web/natiivi-UI:n vahvuusalue.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.godotengine.org/en/stable/tutorials/ui/index.html)
