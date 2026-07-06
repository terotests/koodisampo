# Simulaatiodispatch on tulevaisuudessa raskaampi. Qt-threading-malli?

## Tilanne

Qt 6 on vahva valinta desktop-natiiviin: ikkuna, näppäimistö, offline ja isometrinen piirto ilman selainta. Androidissa voidaan jatkaa valitulla natiivilla UI-linjalla.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Worker QThread + QueuedConnection takaisin GUI:hin — snapshot vain main threadissä

Sama sääntö kuin Compose: logiikka voi olla taustalla, UI ei.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: QPainter suoraan worker-threadistä; Kaikki GameSession GUI-threadissä aina. GUI ei ole thread-safe — QueuedConnection on pakollinen.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://doc.qt.io/qt-6/thread-basics.html)
