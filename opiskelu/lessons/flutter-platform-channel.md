# Pelimoottori ajetaan natiivisti (Kotlin/C++). Miten Flutter kutsuu sitä?

## Tilanne

Flutter tarjoaa yhden UI-koodipohjan mobiilille ja desktopille. Vuoropohjaisessa simulaatiopelissä Flutter on näkymäkerros: simulaatio pysyy erillisessä logiikkakirjastossa tai natiivissa kirjastossa.

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** Platform channel / FFI — natiivi kirjasto palauttaa snapshot-JSONin

MethodChannel tai dart:ffi yhdistää Flutter-UI:n olemassa olevaan moottoriin.

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: Kirjoita koko pelimoottori Dartiksi käsin; Ajetaan Node.js erillisessä prosessissa ilman bridgeä. Pelimoottorin uudelleenkirjoitus Dartiin hylkää pääinvestoinnin.

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin `screen`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](https://docs.flutter.dev/platform-integration/platform-channels)
