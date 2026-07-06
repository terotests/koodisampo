# npm run test:engine ajaa 50+ headless-testiä ilman UI:ta. Hyöty arkkitehtuurivalinnassa?

## Tilanne

Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Logiikka erotettu UI:sta — CI varmistaa säännöt ilman Unity-editoria

Headless-testattu core on vahvuus, jota pelimoottorin vaihto voi heikentää.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Testit vaativat aina Unity Test Runnerin; Headless-testit eivät kata pelilogiikkaa. Simulaatiokerros on testattavissa suoraan — UI ei tarvita.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://nodejs.org/api/test.html)
