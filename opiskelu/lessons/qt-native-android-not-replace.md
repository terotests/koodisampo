# Qt Mobile Androidille — korvaako se valitun Compose-linjan?

## Tilanne

Qt 6 on vahva valinta desktop-natiiviin: ikkuna, näppäimistö, offline ja isometrinen piirto ilman selainta. Androidissa voidaan jatkaa valitulla natiivilla UI-linjalla.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Ei suositella, jos Compose + natiivi core on jo valittu polku; Qt desktop erikseen

Qt desktop + Compose Android on järkevä jako — ei kahta mobiili-UI:ta.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Kyllä — Qt Mobile on aina parempi kuin Compose; Qt ja Compose eivät voi jakaa samaa logiikkaa. Core on jaettu; UI-valinta on alustakohtainen.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://doc.qt.io/qt-6/android.html)
