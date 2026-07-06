# RN kutsuu natiivimoduulia jokaisella näppäinpainalluksella. Mikä riski vuoropohjaisessa pelissä?

## Tilanne

React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Bridge-viive ja serialisointi — turhaa jos logiikka voisi olla natiivissa suoraan

JSAI + bridge on ok listoille; tiheä pelisyöte kannattaa pitää natiivissa.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Bridge estää kaiken JavaScriptin suorituksen; Ei riskiä — bridge on aina alle 1 µs. New Architecture parantaa, mutta arkkitehtuuri on silti ylimääräinen.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://reactnative.dev/architecture/landing-page)
