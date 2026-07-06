# Isometrinen ruudukkokartta Androidissa — mikä Compose-ratkaisu sopii parhaiten?

## Tilanne

Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Canvas + drawIntoCanvas tai custom Layout — piirrät snapshotin rivit/glyfit

Canvas antaa saman vapauden kuin web-canvas — yksi pinta, vähän recompositioita.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: LazyColumn jokaiselle karttariville — skaalautuu parhaiten; WebView joka ajaa web-buildia. Ruudukkopeli hyötyy suorasta piirrosta; LazyColumn on raskas satojen solujen kanssa.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://developer.android.com/jetpack/compose/graphics/draw/overview)
